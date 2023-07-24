const express = require('express');
const router = express.Router();
const auth = require('./middleware/authentification');
const upload = require('./middleware/upload');
const userCtrl = require('./controller/user');
const booksCtrl = require('./controller/books')

// Logique des routes books
router.get('/', booksCtrl.getAllBooks);
router.get('/bestrating', booksCtrl.getBestRating);
router.get('/:id', booksCtrl.getOneBook);
router.post('/', auth, upload, upload.resizeImage, booksCtrl.createBook);
router.post('/:id/rating', auth, booksCtrl.createRating);
router.put('/:id', auth, upload, upload.resizeImage, booksCtrl.modifyBook);
router.delete('/:id', auth, booksCtrl.deleteBook);

// Logique des routes user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;