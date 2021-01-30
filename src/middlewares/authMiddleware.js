const sessionsController = require('../controllers/sessionsController');

const authMiddleware = async (req, res, next) => {
    const session = await sessionsController.findByToken(req.cookies.token);
    if (!session) return res.status(403).send('Invalid token');

    next();
};

module.exports = authMiddleware;