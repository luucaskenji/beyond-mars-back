const router = require('express').Router();

const authMiddleware = require('../middlewares/authMiddleware');
const usersController = require('../controllers/usersController');
const usersSchemas = require('../schemas/usersSchemas');
const NotFoundError = require('../errors/NotFoundError');

router.post('/', async (req, res) => {
    const { error } = usersSchemas.userData.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    const { name } = req.body;

    try {        
        const createdUser = await usersController.create(name);

        const cookieConfig = {
            maxAge: 14*24*60*60*1000,
            httpOnly: false
        }

        res.cookie('token', createdUser.session.token, cookieConfig);
        res.status(201).send(createdUser);
    }
    catch(err) {
        console.error(err);
        res.sendStatus(500);
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    const { error } = usersSchemas.userData.validate(req.body);
    if (error) return res.status(422).send(error.details[0].message);

    const id = parseInt(req.params.id);
    const { name } = req.body;
    
    try {
        const updatedUser = await usersController.edit(id, name);

        res.send(updatedUser);
    }
    catch(err) {
        console.error(err);
        if (err instanceof NotFoundError) res.status(404).send(err.message);
        else res.sendStatus(500);
    }
});

router.post('/:id/sign-out', async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await usersController.delete(id);

        res.sendStatus(204);
    }
    catch(err) {
        console.error(err);
        if (err instanceof NotFoundError) res.status(404).send(err.message);
        else res.sendStatus(500);
    }
});

module.exports = router;