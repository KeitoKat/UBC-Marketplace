const express = require('express');
const auth = require('./auth');
const gpt = require('./gpt');
const index = require('./index');
const items = require('./items');
const reports = require('./reports');
const upload = require('./upload');
const users = require('./users');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', auth);
app.use('/gpt-suggest', gpt);
app.use('/index', index);
app.use('/items', items);
app.use('/reports', reports);
app.use('/upload', upload);
app.use('/users', users);

app.use((req, res) => {
  res.status(404).send('Not Found');
});

module.exports = app;
