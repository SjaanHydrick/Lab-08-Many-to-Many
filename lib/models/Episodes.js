const pool = require('../utils/pool');

module.exports = class Episodes {
    id;
    season;
    episode;
    title;

    constructor(row) {
      this.id = row.id;
      this.episode = row.episode;
      this.title = row.title;
    }

    static async insert({ episode, title, writers = [] }) {
      const { rows } = await pool.query(
        'INSERT INTO episodes (episode, title) VALUES ($1, $2) RETURNING *', [episode, title]
      );

      await pool.query(
        `INSERT INTO episodes_writers (episode_id, writer_id) SELECT ${rows[0].id}, id FROM writers WHERE writers.episode = episodes.episode`, [writers]
      );

      return new Episodes(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT episodes.*,
            array_agg(writers.episode) AS episodes
            FROM episodes_writers
            JOIN episodes
            ON episodes_writers.episode_id = episodes.id
            JOIN writers
            ON episodes_writers.writers_id = writers.id
            WHERE episodes.id=$1
            GROUP BY episodes.id`, [id]
      );

      if(!rows[0]) throw new Error(`No tweet found for id ${id}`);

      return {
        ...new Episodes(rows[0]),
        writers: rows[0].writers
      };
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM episodes');

      return rows.map(row => new Episodes(row));
    }

    static async update(id, { episode, title }) {
      const { rows } = await pool.query('UPDATE episodes SET episode=$1, title=$2 WHERE id=$3 RETURNING *', [episode, title, id]);

      if(!rows[0]) throw new Error(`No episode found for id ${id}`);

      return new Episodes(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query('DELETE FROM episodes WHERE id=$1 RETURNING *', [id]);

      return new Episodes(rows[0]);
    }
};
