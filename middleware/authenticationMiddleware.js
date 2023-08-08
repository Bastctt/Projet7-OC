const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        const authToken = req.headers.authorization.split(' ')[1];
        const decodedAuthToken = jwt.verify(authToken, 'RANDOM_TOKEN_SECRET');

        req.auth = {
            userId: decodedAuthToken.userId
        };
        
        next();
    } catch (error) {
        res.status(401).json({ error: 'Authentification échouée' });
    }
};
