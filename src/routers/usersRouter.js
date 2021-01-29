const router = require('express').Router();

const usersController = require('../controllers/usersController');
const usersSchemas = require('../schemas/usersSchemas');

router.post('/', async (req, res) => {
    const { error } = usersSchemas.userData.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    try {
        let { name } = req.body;
        
        const createdUser = await usersController.createUser(name);

        const cookieConfig = {
            maxAge: 14*24*60*60*1000,
            httpOnly: false
        }

        res.cookie('token', createdUser.session.token, cookieConfig);
        res.status(201).send(createdUser);
    }
    catch {
        res.sendStatus(500);
    }
});

module.exports = router;