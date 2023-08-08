require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const appRoutes = require('../backend/routes');
const path = require('path');
const dbPassword = require('./utils/dbPassword');

const mongodbUri = `mongodb://bastctt:${dbPassword}@ac-hqimfph-shard-00-00.rukwpky.mongodb.net:27017,ac-hqimfph-shard-00-01.rukwpky.mongodb.net:27017,ac-hqimfph-shard-00-02.rukwpky.mongodb.net:27017/?ssl=true&replicaSet=atlas-yv1a6w-shard-0&authSource=admin&retryWrites=true&w=majority`;

mongoose.connect(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connexion à MongoDB effectuée'))
  .catch(() => console.error('Connexion à MongoDB impossible'));

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', appRoutes);
app.use('/api/books', appRoutes);

module.exports = app;


