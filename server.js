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

  const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;

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

app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send('Serveur actif');
});

// Démarrage du serveur
app.listen(port, () => {
  console.log('Server started on port ' + port);
});
