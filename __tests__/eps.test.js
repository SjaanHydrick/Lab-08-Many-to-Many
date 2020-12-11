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

  it('creates a new tweet via POST', async() => {
    const response = await request(app)
      .post('/episodes')
      .send({
        episode: 36,
        title: 'To Cut a Woman\'s Hair'
      });

    expect(response.body).toEqual({
      id: '1',
      episode: '36',
      title: 'To Cut a Woman\'s Hair'
    });
  });

  it.only('finds a tween by id via GET', async() => {
    await Promise.all([
      { name: 'Rebecca Sugar',
        episode: 37 
      }, {
        name: 'Bert Youn',
        episode: 82
      }, {
        name: 'Jesse Moynihan',
        episode: 166
      }].map(writer => Writers.insert(writer)));

    const episode = await Episodes.insert({
      episode: 166,
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
        episode: 19,
        title: 'Mystery Train'
      }, {
        episode: 203,
        title: 'Mama Said'
      }, {
        episode: 226,
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
      episode: 54,
      title: 'Cold Signature'
    });

    const response = await request(app)
      .put(`/episodes/${ep.id}`)
      .send({
        episode: 52,
        title: 'Heat Signature'
      });

    expect(response.body).toEqual({
      id: ep.id,
      episode: 52,
      title: 'Heat Signature'
    });
  });

  it('deletes an episode by id', async() => {
    const ep = await Episodes.insert({
      episode: 1,
      title: 'Slumber Party Panic'
    });

    const response = await request(app)
      .delete(`/episodes/${ep.id}`);

    expect(response.body).toEqual(ep);
  });
});
