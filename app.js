const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');

const booksRoutes = require('./routes/books');
const userRoutes = require('./routes/user');
const password = require('./utils/password');

const app = express();

// Middleware pour gérer les requêtes JSON
app.use(express.json());

// Middleware pour gérer les requêtes CORS
app.use(cors());

// Connexion à la base de données
mongoose
  .connect(
    `mongodb+srv://ClaireDV:${password}@monvieuxgrimoirep7oc.nnybhep.mongodb.net/?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true, // Utilisez useCreateIndex pour éviter un avertissement de dépréciation
    }
  )
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée :', error));

// Gestion de la ressource images de manière statique
app.use('/images', express.static(path.join(__dirname, 'images')));

// Enregistrement des routeurs
app.use('/api/auth', userRoutes);
app.use('/api/books', booksRoutes);

module.exports = app;
