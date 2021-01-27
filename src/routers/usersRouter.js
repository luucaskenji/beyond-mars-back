const router = require('express').Router();

const usersController = require('../controllers/usersController');
const usersSchemas = require('../schemas/usersSchemas');

router.post('/', (req, res) => {
    const { error } = usersSchemas.userData.validate(req.body);

    if (error) return res.status(422).send(error.details[0].message);

    res.sendStatus(201);
});

module.exports = router;