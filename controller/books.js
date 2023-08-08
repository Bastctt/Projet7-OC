const Book = require('../schema/bookSchema');
const calculateAverage = require('../utils/average');
const fsPromises = require('fs').promises;

// POST => Enregistrement d'un livre
exports.createBook = async (req, res, next) => {
    try {
        const bookData = JSON.parse(req.body.book);
        delete bookData._id;
        delete bookData._userId;

        const newBookData = {
            ...bookData,
            userId: req.auth.userId,
            imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`,
            averageRating: bookData.ratings[0].grade
        };

        const newBook = new Book(newBookData);
        await newBook.save();
        res.status(201).json({ message: 'Livre enregistré' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// GET => Récupération d'un livre spécifique
exports.getOneBook = async (req, res, next) => {
    try {
        const book = await Book.findOne({ _id: req.params.id });
        if (book) {
            res.status(200).json(book);
        } else {
            res.status(404).json({ message: 'Livre non trouvé' });
        }
    } catch (error) {
        res.status(404).json({ error });
    }
};

// PUT => Modification d'un livre existant
exports.modifyBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const existingBook = await Book.findOne({ _id: bookId });

        if (!existingBook) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }

        if (existingBook.userId !== req.auth.userId) {
            res.status(403).json({ message: '403: Requête non autorisée' });
            return;
        }

        if (req.file) {
            const filename = existingBook.imageUrl.split('/images/')[1];
            await fsPromises.unlink(`images/${filename}`);
        }

        const updatedBookData = req.file
            ? {
                  ...JSON.parse(req.body.book),
                  imageUrl: `${req.protocol}://${req.get('host')}/images/resized_${req.file.filename}`
              }
            : { ...req.body };

        await Book.updateOne({ _id: bookId }, { ...updatedBookData, _id: bookId });
        res.status(200).json({ message: 'Livre modifié ' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// DELETE => Suppression d'un livre
exports.deleteBook = async (req, res, next) => {
    try {
        const bookId = req.params.id;
        const existingBook = await Book.findOne({ _id: bookId });

        if (!existingBook) {
            res.status(404).json({ message: 'Livre non trouvé' });
            return;
        }

        if (existingBook.userId !== req.auth.userId) {
            res.status(403).json({ message: '403: Requête non autorisée' });
            return;
        }

        const filename = existingBook.imageUrl.split('/images/')[1];
        await fsPromises.unlink(`images/${filename}`);
        await Book.deleteOne({ _id: bookId });
        res.status(200).json({ message: 'Livre supprimé' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// GET => Récupération de tous les livres
exports.getAllBooks = async (req, res, next) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ error });
    }
};

// POST => Création d'une note
exports.createRating = async (req, res, next) => {
    try {
        const rating = req.body.rating;
        if (rating >= 0 && rating <= 5) {
            const ratingObject = { ...req.body, grade: rating };
            delete ratingObject._id;

            const existingBook = await Book.findOne({ _id: req.params.id });

            if (!existingBook) {
                res.status(404).json({ message: 'Livre non trouvé' });
                return;
            }

            const userIdArray = existingBook.ratings.map(rating => rating.userId);
            if (userIdArray.includes(req.auth.userId)) {
                res.status(403).json({ message: 'Non autorisé' });
                return;
            }

            const newRatings = [...existingBook.ratings, ratingObject];
            const grades = newRatings.map(rating => rating.grade);
            const averageGrades = calculateAverage(grades);

            await Book.updateOne({ _id: req.params.id }, { ratings: newRatings, averageRating: averageGrades, _id: req.params.id });

            res.status(201).json({ message: 'Note créée' });
        } else {
            res.status(400).json({ message: 'La note doit être comprise entre 0 et 5 étoiles' });
        }
    } catch (error) {
        res.status(400).json({ error });
    }
};

// GET => Récupération des 3 livres les mieux notés
exports.getBestRating = async (req, res, next) => {
    try {
        const books = await Book.find().sort({ averageRating: -1 }).limit(3);
        res.status(200).json(books);
    } catch (error) {
        res.status(404).json({ error });
    }
};

