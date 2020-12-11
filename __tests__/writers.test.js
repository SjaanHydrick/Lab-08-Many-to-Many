const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Writers = require('../lib/models/Writers');

describe('writers routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new writer via POST', async() => {
    const res = await request(app)
      .post('/writers')
      .send({
        name: 'Adam Muto'
      });

    expect(res.body).toEqual({
      id: '1',
      name: 'Adam Muto'
    });
  });

  it('finds a writer by id', async() => {
    const sugar = await Writers.insert({
      name: 'Rebecca Sugar'
    });

    const res = await request(app)
      .get(`/writers/${sugar.id}`);

    expect(res.body).toEqual({
      id: sugar.id,
      name: 'Rebecca Sugar'
    });
  });

  it('finds all writer via GET', async() => {
    const group = await Promise.all([
      {
        name: 'Niki Yang'
      }, {
        name: 'Pendleton Ward'
      }, {
        name: 'Tom Herpich'
      }].map(writers => Writers.insert(writers)));

    const response = await request(app)
      .get('/writers');

    expect(response.body).toEqual(expect.arrayContaining(group));
    expect(response.body).toHaveLength(group.length);
  });

  it('updates a writer via PUT', async() => {
    const sanchez = await Writers.insert({
      name: 'Cole Connor'
    });

    const response = await request(app)
      .put(`/writers/${sanchez.id}`)
      .send({
        name: 'Cole Sanchez'
      });

    expect(response.body).toEqual({
      id: sanchez.id,
      name: 'Cole Sanchez'
    });
  });

  it('deletes an writer by id', async() => {
    const allegri = await Writers.insert({
      name: 'Natasha Allegri'
    });

    const response = await request(app)
      .delete(`/writers/${allegri.id}`);

    expect(response.body).toEqual(allegri);
  });
});
