const User = require('../models/User');
const sanitize = require('../utils/sanitizer');

class UsersController {
    createUser(name) {
        [name] = sanitize([name]);
        name = name.replace(name[0], name[0].toUpperCase());

        return User.create({ name });
    }
}

module.exports = new UsersController();