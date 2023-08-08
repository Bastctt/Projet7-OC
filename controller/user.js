const bcrypt = require('bcrypt');
const User = require('../schema/userSchema');
const jwt = require('jsonwebtoken');

// POST => Création de compte
exports.signup = async (req, res, next) => {
    try {
        const hashPassword = await bcrypt.hash(req.body.password, 10);

        const newUser = new User({
            email: req.body.email,
            passwordHash: hashPassword
        });

        await newUser.save();
        res.status(201).json({ message: 'Compte créé' });
    } catch (error) {
        res.status(400).json({ error });
    }
};

// POST => Connexion
exports.login = async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        if (!existingUser) {
            return res.status(401).json({ error: 'Compte non trouvé' });
        }

        const isValidPassword = await bcrypt.compare(req.body.password, existingUser.passwordHash);

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Mot de passe incorrect veuillez saisir un mot de passe valide' });
        }

        const token = jwt.sign(
            { userId: existingUser._id },
            'RANDOM_TOKEN_SECRET',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            userId: existingUser._id,
            token
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};
