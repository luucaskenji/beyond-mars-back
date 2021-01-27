const router = require('express').Router();

const usersController = require('../controllers/usersController');

router.post('/', (req, res) => {
    res.send(usersController.createUser());
});

module.exports = router;