require('dotenv').config();
const supertest = require('supertest');
const db = require('../src/utils/database');
const app = require('../src/app');

const agent = supertest(app);

beforeEach(async () => {
    await db.query(`
        DELETE FROM sessions;
        DELETE FROM users;
        DELETE FROM photos;
    `);
});

afterAll(async () => {
    await db.query(`
        DELETE FROM sessions;
        DELETE FROM users;
        DELETE FROM photos;
    `);

    await db.close();
});

describe('POST /users', () => {
    it('should return created user if sent name passes in joi validation', async () => {
        const body = { name: 'Lucas' };

        const response = await agent.post('/users').send(body);

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject(
            expect.objectContaining({
                id: expect.any(Number),
                name: 'Lucas',
                session: {
                    id: expect.any(Number),
                    token: expect.any(String)
                }
            })
        );
    });

    it('should return status code 422 if name is not at least 2 characters long', async () => {
        const body = { name: 'L' };

        const response  = await agent.post('/users').send(body);

        expect(response.status).toBe(422);
    });

    it('should return status code 422 if name is more than 20 characters long', async () => {
        const body = { name: 'Lucas Rodrigues Bulambashiko' };

        const response  = await agent.post('/users').send(body);

        expect(response.status).toBe(422);
    });

    it('should return status code 422 if name is not a string', async () => {
        const body = { name: 123 };

        const response  = await agent.post('/users').send(body);

        expect(response.status).toBe(422);
    });

    it('should return status code 422 if name is not sent', async () => {
        const body = { nome: 'Lucas' };

        const response  = await agent.post('/users').send(body);

        expect(response.status).toBe(422);
    });
});