const Session = require('../models/Session');

class SessionsController {
    findByToken(token) {
        return Session.findOne({ where: { token } })
    }
}

module.exports = new SessionsController();