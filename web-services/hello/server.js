'use strict';
const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));

app.get('/hello/:name', (req, res) => {
  res.status(200).json({ 'hello': req.params.name });
});

app.listen(60701, () => console.log('Ready.'));
