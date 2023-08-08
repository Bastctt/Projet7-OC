const express = require('express');
const router = express.Router();

// Import des middlewares et contrôleurs
const authenticationMiddleware = require('./middleware/authenticationMiddleware');
const uploadMiddleware = require('./middleware/uploadMiddleware');
const userController = require('./controller/user');
const booksController = require('./controller/books');

// Routes liées aux livres
router.get('/', booksController.getAllBooks);
router.get('/bestrating', booksController.getBestRating);
router.get('/:id', booksController.getOneBook);
router.post('/', authenticationMiddleware, uploadMiddleware, uploadMiddleware.resizeImage, booksController.createBook);
router.post('/:id/rating', authenticationMiddleware, booksController.createRating);
router.put('/:id', authenticationMiddleware, uploadMiddleware, uploadMiddleware.resizeImage, booksController.modifyBook);
router.delete('/:id', authenticationMiddleware, booksController.deleteBook);

// Routes liées aux utilisateurs
router.post('/signup', userController.signup);
router.post('/login', userController.login);

module.exports = router;
