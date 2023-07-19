const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const password = require('./utils/password');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');

const app = express();

// Middleware pour gérer les requêtes JSON
app.use(express.json());

// Middleware pour gérer les requêtes CORS
app.use(cors());

// Connexion à la base de données MongoDB
const uri = `mongodb+srv://bastctt:${password}@cluster0.rukwpky.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

client
  .connect()
  .then(() => {
    const db = client.db('@cluster0'); 
    console.log('Connexion à MongoDB réussie !');

    // Enregistrement des routeurs
    app.use('/api/auth', userRoutes);
    app.use('/api/books', booksRoutes);

    // Gestion de la ressource images de manière statique
    app.use('/images', express.static(path.join(__dirname, 'images')));

    // Démarrage du serveur
    const port = process.env.PORT || 4000;
    app.listen(port, () => {
      console.log(`Serveur démarré sur le port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Connexion à MongoDB échouée :', error);
  });

module.exports = app;


