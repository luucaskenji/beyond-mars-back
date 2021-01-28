require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const usersRouter = require('./routers/usersRouter');
const photosRouter = require('./routers/photosRouter');

app.use('/users', usersRouter);
app.use('/photos', photosRouter);

module.exports = app;