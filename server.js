const http = require('http');
const app = require('./app');

// Configuration du port
const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Gestion des erreurs
const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Middleware pour les requêtes de journalisation
app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Serveur actif');
});

// Création du serveur
const server = http.createServer(app);

// Gestion des événements du serveur
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Server is listening on ' + bind);
});

// Démarrage du serveur
server.listen(port, () => {
  console.log('Server started on port ' + port);
});
