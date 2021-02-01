require('dotenv').config();
const supertest = require('supertest');
const db = require('../src/utils/database');
const app = require('../src/app');
const sessionsController = require('../src/controllers/sessionsController');

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

describe('PUT /users/:id', () => {
    it("should change user's name if it passes in joi validation", async () => {
        const body = { name: 'Lucas Timoshenko' };

        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response = await agent
            .put(`/users/${testUser.body.id}`)
            .set('cookie', `token=${testUser.body.session.token}`)
            .send(body);

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            id: expect.any(Number),
            name: 'Lucas Timoshenko'
        });
    });

    it('should return status code 403 if an invalid token is sent', async () => {
        const body = { name: 'Lucas Timoshenko' };

        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response = await agent
            .put(`/users/${testUser.body.id}`)
            .set('cookie', 'token=anInvalidToken')
            .send(body);
        
        expect(response.status).toBe(403);
    });

    it('should return status code 404 if there is not any user in database with sent id', async () => {
        const spy = jest.spyOn(sessionsController, 'findByToken');

        sessionsController.findByToken.mockImplementationOnce(() => true);
        
        const body = { name: 'Lucas' };
        
        const response = await agent
            .put('/users/145875')
            .send(body);
        
        expect(response.status).toBe(404);

        spy.mockRestore();
    });

    it('should return status code 422 if name is not at least 2 characters long', async () => {
        const body = { name: 'L' };

        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response  = await agent
            .put(`/users/${testUser.body.id}`).send(body)
            .set('cookie', `token=${testUser.body.session.token}`)
            .send(body);

        expect(response.status).toBe(422);
    });

    it('should return status code 422 if name is more than 20 characters long', async () => {
        const body = { name: 'Lucas Rodrigues Bulambashiko' };

        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response  = await agent
            .put(`/users/${testUser.body.id}`).send(body)
            .set('cookie', `token=${testUser.body.session.token}`)
            .send(body);

        expect(response.status).toBe(422);
    });

    it('should return status code 422 if name is not a string', async () => {
        const body = { name: 123 };

        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response  = await agent
            .put(`/users/${testUser.body.id}`).send(body)
            .set('cookie', `token=${testUser.body.session.token}`)
            .send(body);

        expect(response.status).toBe(422);
    });

    it('should return status code 422 if name is not sent', async () => {
        const body = { nome: 'Lucas' };

        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response  = await agent
            .put(`/users/${testUser.body.id}`).send(body)
            .set('cookie', `token=${testUser.body.session.token}`)
            .send(body);

        expect(response.status).toBe(422);
    });
});

describe('POST /users/:id/sign-out', () => {
    it('should return status code 204 if signing out process has been successfully done', async () => {
        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response = await agent
            .post(`/users/${testUser.body.id}/sign-out`)
            .set('cookie', `token=${testUser.body.session.token}`);

        expect(response.status).toBe(204);
    });

    it('should return status code 403 if invalid token is sent', async () => {
        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response = await agent
            .post(`/users/${testUser.body.id}/sign-out`)
            .set('cookie', 'token=anInvalidToken');

        expect(response.status).toBe(403);
    });

    it('should return status code 404 if there is not any user in database with sent id', async () => {
        const spy = jest.spyOn(sessionsController, 'findByToken');
        sessionsController.findByToken.mockImplementationOnce(() => true);        
        
        const response = await agent.post('/users/12584684/sign-out');

        expect(response.status).toBe(404);

        spy.mockRestore();
    });
});

describe('POST /photos/:id/likes', () => {
    it('should save sent photo on database and return it with 1 like', async () => {
        const photoId = 123;

        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        const response = await agent
            .post(`/photos/${photoId}/likes`)
            .set('cookie', `token=${testUser.body.session.token}`);
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: photoId,
                likes: 1
            })
        );
    });

    it('should return photo with 2 likes if sent photo id was already saved on database', async () => {
        const photoId = 123;

        const testUser = await agent.post('/users').send({ name: 'Lucas' });
        await agent
            .post(`/photos/${photoId}/likes`)
            .set('cookie', `token=${testUser.body.session.token}`);
        
        const response = await agent
            .post(`/photos/${photoId}/likes`)
            .set('cookie', `token=${testUser.body.session.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: photoId,
                likes: 2
            })
        );
    });
});