const router = require('express').Router();

const photosController = require('../controllers/photosController');

router.post('/:id/likes', async (req, res) => {
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

module.exports = router;