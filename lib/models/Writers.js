const pool = require('../utils/pool');

module.exports = class Writers {
    id;
    name;

    constructor(row) {
      this.id = row.id;
      this.name = row.name;
    }

    static async insert({ name }) {
      const { rows } = await pool.query(
        'INSERT INTO writers (name) VALUES ($1) RETURNING *', [name]
      );

      return new Writers(rows[0]);
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM writers WHERE id=$1', [id]);

      if(!rows[0]) throw new Error (`No writer found for id ${id}`);

      return {
        ...new Writers(rows[0]),
        episodes: rows[0].episodes
      };
    }

    static async find() {
      const { rows } = await pool.query('SELECT * FROM writers');

      return rows.map(row => new Writers(row));
    }

    static async update(id, { name }) {
      const { rows } = await pool.query('UPDATE writers SET name=$1 WHERE id=$2 RETURNING *', [name, id]);

      if(!rows[0]) throw new Error (`No writer found for id ${id}`);

      return new Writers(rows[0]);
    }

    static async delete(id) {
      const { rows } = await pool.query('DELETE FROM writers WHERE id=$1 RETURNING *', [id]);

      return new Writers(rows[0]);
    }
};
