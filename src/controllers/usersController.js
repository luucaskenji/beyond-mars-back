const uuid = require('uuid');

const User = require('../models/User');
const Session = require('../models/Session');
const sanitize = require('../utils/sanitizer');
const NotFoundError = require('../errors/NotFoundError');

class UsersController {
    async create(name) {
        name = this._sanitizeAndStandardize(name);
        
        const newUser = await User.create({ name });
        await Session.create({ userId: newUser.id, token: uuid.v4() });

        return User.findOne({
            where: {
                id: newUser.id
            },
            attributes: {
                exclude: ['createdAt', 'updatedAt']
            },
            include: {
                model: Session,
                attributes: {
                    exclude: ['createdAt', 'updatedAt', 'userId']
                }
            }
        });
    }

    async edit(id, newName) {
        newName = this._sanitizeAndStandardize(newName);

        const requiredUser = await User.findByPk(id);

        if (!requiredUser) throw new NotFoundError('User not found');

        requiredUser.name = newName;
        await requiredUser.save();

        return requiredUser;
    }

    async delete(id) {
        const user = await User.findByPk(id);

        if (!user) throw new NotFoundError('User not found');
        
        await Session.destroy({ where: { userId: id } });
        await user.destroy();
    }

    _sanitizeAndStandardize(name) {
        [name] = sanitize([name]);
        name = name.replace(name[0], name[0].toUpperCase());

        return name;
    }
}

module.exports = new UsersController();