const uuid = require('uuid');

const User = require('../models/User');
const Session = require('../models/Session');
const sanitize = require('../utils/sanitizer');

class UsersController {
    async createUser(name) {
        [name] = sanitize([name]);
        name = name.replace(name[0], name[0].toUpperCase());
        
        const newUser = await User.create({ name });
        await Session.create({ userId: newUser.id, token: uuid.v4() });

        return newUser;
    }
}

module.exports = new UsersController();