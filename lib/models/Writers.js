const pool = require('../utils/pool');

module.exports = class Writers {
    id;
    name;
    episode;

    constructor(row) {
      this.id = row.id;
      this.name = row.name;
      this.episode = row.episode;
    }

    static async insert({ name, episode, episodes = [] }) {
      const { rows } = await pool.query(
        'INSERT INTO writers (name, episode) VALUES ($1, $2) RETURNING *', [name, episode]
      );

      await pool.query(
        `INSERT INTO episodes_writers (episode_id, writer_id)
        SELECT ${rows[0].id}, id FROM episodes WHERE episodes.episode = writers.episode`, [episodes]
      );

      return new Writers(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT writers.*,
          array_agg(episodes.episode) AS episodes
          FROM episodes_writers
          JOIN writers
          ON episodes_writers.writers_id = writers.id
          JOIN episodes
          ON episodes_writers.episodes_id = episodes.id
          WHERE writers.id=$1
          GROUP BY writers.id`, [id]
      );

      if(!rows[0]) throw new Error (`No writer found for id ${id}`);

      return {
        ...new Writers(rows[0]),
        episodes: rows[0].episodes
      };
    }

    static async find() {
      const {rows } = await pool.query('SELECT * FROM writers');

      return rows.map(row => new Writers(row));
    }

    static async update(id, { name, episode }) {
      const { rows } = await pool.query('UPDATE writers SET name=$1, episode=$2 WHERE id=$3 RETURNING *', [name, episode, id]);

      if(!rows[0]) throw new Error (`No writer found for id ${id}`);

      return new Writers(rows[0]);
    }

    static async delete(id) {
      const { rows } = pool.query('DELETE FROM writers WHERE id=$1 RETURNING *', [id]);

      return new Writers(rows[0]);
    }
};
