const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const route = require('./routes/route');
const { mongoose } = require('./db/mongoose');

const app = express();

app.use(bodyParser.json());

app.use(cors({
    'allowedHeaders': ['sessionId', 'Content-Type', 'x-auth', 'Authorization'],
    'exposedHeaders': ['sessionId', 'x-auth', 'Authorization'],
    'origin': '*',
    'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    'preflightContinue': false
}));

// app.options('*', cors());

app.use(route);

app.listen(process.env.PORT || 3000);