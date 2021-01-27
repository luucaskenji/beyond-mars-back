require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const usersRouter = require('./routers/usersRouter');

app.use('/users', usersRouter);

module.exports = app;