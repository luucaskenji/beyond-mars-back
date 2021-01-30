const router = require('express').Router();

const photosController = require('../controllers/photosController');
const authMiddleware = require('../middlewares/authMiddleware');
const NotFoundError = require('../errors/NotFoundError');

router.post('/:id/likes', authMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const newPhoto = await photosController.postLike(id);

        res.send(newPhoto);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.post('/:id/dislikes', authMiddleware, async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const updatedPhoto = await photosController.postDislike(id);

        res.send(updatedPhoto);
    }
    catch(err) {
        console.error(err);
        if (err instanceof NotFoundError) res.status(404).send(err.message);
        else res.sendStatus(500);
    }
});

router.get('/:id/likes', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        const requiredPhoto = await photosController.getLikes(id);

        res.send(requiredPhoto);
    }
    catch {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;