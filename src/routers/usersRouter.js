const router = require('express').Router();

const usersController = require('../controllers/usersController');
const usersSchemas = require('../schemas/usersSchemas');

router.post('/', async (req, res) => {
    const { error } = usersSchemas.userData.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    try {
        let { name } = req.body;
        
        const createdUser = await usersController.createUser(name);

        res.status(201).send(createdUser);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
});

module.exports = router;