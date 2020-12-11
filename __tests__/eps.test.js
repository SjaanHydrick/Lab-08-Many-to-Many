const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Episodes = require('../lib/models/Episodes');
const Writers = require('../lib/models/Writers');

describe('episodes routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates an episode via POST', async() => {
    const response = await request(app)
      .post('/episodes')
      .send({
        title: 'To Cut a Woman\'s Hair'
      });

    expect(response.body).toEqual({
      id: '1',
      title: 'To Cut a Woman\'s Hair'
    });
  });

  it('finds an episode by id via GET', async() => {
    await Promise.all([
      { name: 'Rebecca Sugar',
      }, {
        name: 'Bert Youn',
      }, {
        name: 'Jesse Moynihan',
      }].map(writer => Writers.insert(writer)));

    const episode = await Episodes.insert({
      title: 'Something Big',
      writers: ['Jesse Moynihan']
    });

    const response = await request(app)
      .get(`/episodes/${episode.id}`);

    expect(response.body).toEqual({
      ...episode,
      writers: ['Jesse Moynihan']
    });
  });

  it('finds all episodes via GET', async() => {
    const eps = await Promise.all([
      {
        title: 'Mystery Train'
      }, {
        title: 'Mama Said'
      }, {
        title: 'Broke His Crown'
      }
    ].map(ep => Episodes.insert(ep)));

    const response = await request(app)
      .get('/episodes');

    expect(response.body).toEqual(expect.arrayContaining(eps));
    expect(response.body).toHaveLength(eps.length);
  });

  it('updates an episode via PUT', async() => {
    const ep = await Episodes.insert({
      title: 'Cold Signature'
    });

    const response = await request(app)
      .put(`/episodes/${ep.id}`)
      .send({
        title: 'Heat Signature'
      });

    expect(response.body).toEqual({
      id: ep.id,
      title: 'Heat Signature'
    });
  });

  it('deletes an episode by id', async() => {
    const ep = await Episodes.insert({
      title: 'Slumber Party Panic'
    });

    const response = await request(app)
      .delete(`/episodes/${ep.id}`);

    expect(response.body).toEqual(ep);
  });
});
