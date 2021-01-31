require('dotenv').config();

const usersController = require('../../src/controllers/usersController');
const User = require('../../src/models/User');
const Session = require('../../src/models/Session');
const NotFoundError = require('../../src/errors/NotFoundError');

jest.mock('../../src/models/User.js');
jest.mock('../../src/models/Session.js');

jest.mock('string-strip-html', () => {
    return {
        stripHtml: string => ({ result: string })
    }
});

jest.mock('uuid', () => {
    return {
        v4: () => 123
    }
});

describe('creating user', () => {
    it('should create user with standardized name (first letter in upper case) - function create', async () => {
        const lowerCaseName = 'lucas';

        User.create.mockResolvedValueOnce({ id: 1, name: 'Lucas' });
        Session.create.mockResolvedValueOnce({ id: 1, userId: 1, token: 'token' });
        User.findOne.mockResolvedValueOnce({ id: 1, name: 'Lucas', session: { id: 1, token: 'token' } });

        await usersController.create(lowerCaseName);

        expect(User.create).toHaveBeenCalled();
        expect(User.create).toHaveBeenCalledWith({ name: 'Lucas' });
    });
});

describe('editing user', () => {
    it('should throw a NotFoundError if required user does not exist - function edit', async () => {
        User.findByPk.mockResolvedValueOnce(null);

        const editFunction = usersController.edit(1, 'Lucas');

        expect(editFunction).rejects.toThrow(NotFoundError);
        expect(editFunction).rejects.toThrow('User not found');
    });
});