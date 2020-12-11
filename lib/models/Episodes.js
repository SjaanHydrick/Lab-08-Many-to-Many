const pool = require('../utils/pool');

module.exports = class Episodes {
    id;
    title;

    constructor(row) {
      this.id = row.id;
      this.title = row.title;
    }

    static async insert({ title, writers = [] }) {
      const { rows } = await pool.query(
        'INSERT INTO episodes (title) VALUES ($1) RETURNING *', [title]
      );

      await pool.query(
        `INSERT INTO episodes_writers (episode_id, writer_id) SELECT ${rows[0].id}, id FROM writers WHERE name = ANY($1::text[])`, [writers]
      );

      return new Episodes(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        `SELECT episodes.*,
            array_agg(writers.name) AS writers
            FROM episodes_writers
            JOIN episodes
            ON episodes_writers.episode_id = episodes.id
            JOIN writers
            ON episodes_writers.writer_id = writers.id
            WHERE episodes.id=$1
            GROUP BY episodes.id`, [id]
      );

      if(!rows[0]) throw new Error(`No episode found for id ${id}`);

      return {
        ...new Episodes(rows[0]),
        writers: rows[0].writers
      };
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM episodes');

      return rows.map(row => new Episodes(row));
    }

    static async update(id, { title }) {
      const { rows } = await pool.query('UPDATE episodes SET title=$1 WHERE id=$2 RETURNING *', [title, id]);

      if(!rows[0]) throw new Error(`No episode found for id ${id}`);

      return new Episodes(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query('DELETE FROM episodes WHERE id=$1 RETURNING *', [id]);

      return new Episodes(rows[0]);
    }
};
