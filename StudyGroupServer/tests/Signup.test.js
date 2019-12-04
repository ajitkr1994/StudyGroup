const request = require('supertest')
const app = require('../server')
const { MongoClient } = require('mongodb');

describe('Sign up', () => {
    let connection;
    let db;

    /**
     * Insert test data.
     */
    beforeAll(async (done) => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db(global.__MONGO_DB_NAME__);
        // Make email unique
        await db.collection('users').createIndex( { "email" : 1 }, { unique : true } );
        done();
    });

    /**
     * Clear test data
     */
    afterAll(async (done) => {
        const users = db.collection('users');
        await users.deleteMany({});
        await connection.close();
        done();
    });

    it('should add user', async (done) => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                name: 'test',
                email: 'test@ucsd.edu',
                password: 'password'
            });

        expect(res.statusCode).toEqual(200);
        const insertedUser = await db.collection('users').findOne({ email: 'test@ucsd.edu' });
        expect(insertedUser.name).toEqual('test');
        expect(insertedUser.id).not.toBeNull();
        expect(insertedUser.joinedGroups).toEqual([]);
        done();
    });

    it('should not add user if missing name', async (done) => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                name: '',
                email: 'test2@ucsd.edu',
                password: 'password'
            });

        expect(res.statusCode).toEqual(400);
        const insertedUser = await db.collection('users').findOne({ email: 'test2@ucsd.edu' });
        expect(insertedUser).toBeNull();
        done();
    });

    it('should not add user if missing email', async (done) => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                name: 'test2',
                password: 'password'
            });
        
        expect(res.statusCode).toEqual(400);
        const insertedUser = await db.collection('users').findOne({ name: 'test2' });
        expect(insertedUser).toBeNull();
        done();
    });

    it('should not add user if missing password', async (done) => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                name: 'test2',
                email: 'test2@ucsd.edu',
            });

        expect(res.statusCode).toEqual(400)
        const insertedUser = await db.collection('users').findOne({ email: 'test2@ucsd.edu' });
        expect(insertedUser).toBeNull();
        done();
    });

    it('should not add user with same email', async (done) => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                name: 'test',
                email: 'test@ucsd.edu',
                password: 'password'
            });

        expect(res.statusCode).toEqual(500);
        const insertedUser = await db.collection('users').find({ email: 'test@ucsd.edu' }).toArray();
        expect(insertedUser.length).toEqual(1);
        done();
    });

    it('can add another user', async (done) => {
        const res = await request(app)
            .post('/api/user/signup')
            .send({
                name: 'test2',
                email: 'test2@ucsd.edu',
                password: 'password'
            });

        expect(res.statusCode).toEqual(200);
        const insertedUser = await db.collection('users').findOne({ email: 'test2@ucsd.edu' });
        expect(insertedUser.name).toEqual('test2');
        expect(insertedUser.id).not.toBeNull();
        expect(insertedUser.joinedGroups).toEqual([]);
        done();
    });
});

