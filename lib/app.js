const express = require('express');
const Episodes = require('./models/Episodes');
const Writers = require('./models/Writers');
const app = express();

app.use(express.json());

app.post('/episodes', (req, res, next) => {
  Episodes
    .insert(req.body)
    .then(episode => res.send(episode))
    .catch(next);
});

app.post('/writers', (req, res, next) => {
  Writers
    .insert(req.body)
    .then(writer => res.send(writer))
    .catch(next);
});

app.get('/episodes/:id', (req, res, next) => {
  Episodes
    .findById(req.params.id)
    .then(episode => res.send(episode))
    .catch(next);
});

app.get('/writers/:id', (req, res, next) => {
  Writers
    .findById(req.params.id)
    .then(writer => res.send(writer))
    .catch(next);
});

app.get('/episodes', (req, res, next) => {
  Episodes
    .find()
    .then(episode => res.send(episode))
    .catch(next);
});

app.get('/writers', (req, res, next) => {
  Writers
    .find()
    .then(writer => res.send(writer))
    .catch(next);
});

app.put('/episodes/:id', (req, res, next) => {
  Episodes
    .update(req.params.id, req.body)
    .then(episode => res.send(episode))
    .catch(next);
});

app.put('/writers/:id', (req, res, next) => {
  Writers
    .update(req.params.id, req.body)
    .then(writer => res.send(writer))
    .catch(next);
});

app.delete('/episodes/:id', (req, res, next) => {
  Episodes
    .delete(req.params.id)
    .then(episode => res.send(episode))
    .catch(next);
});

app.delete('/writers/:id', (req, res, next) => {
  Writers
    .delete(req.params.id)
    .then(writer => res.send(writer))
    .catch(next);
});

module.exports = app;
