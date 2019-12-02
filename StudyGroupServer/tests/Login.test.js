const request = require('supertest')
const app = require('../server')
const { MongoClient } = require('mongodb');

describe('Sign up', () => {
    let connection;
    let db;
    let token;

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
        Alice = {
            _id: 1,
            name: "Alice",
            email: "alice@ucsd.edu",
            password: "alice",
            joinedGroups: []
        };
        await db.collection('users').insertOne(Alice);
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

    it('correct username password gets token', async (done) => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'alice@ucsd.edu',
                password: 'alice'
            });

        expect(res.statusCode).toEqual(200);
        // all tokens start with e.
        token = res.text
        expect(res.text[0]).toEqual('e');
        console.log(res.text);
        done();
    });

    it('incorrect username does not get token', async (done) => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'alice@ucsd2.edu',
                password: 'alice'
            });

        expect(res.statusCode).toEqual(401);
        // all tokens start with e.
        expect(res.text[0]).not.toEqual('e');
        console.log(res.text);
        done();
    });

    it('incorrect password does not get token', async (done) => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'alice@ucsd.edu',
                password: 'alice2'
            });

        expect(res.statusCode).toEqual(401);
        // all tokens start with e.
        expect(res.text[0]).not.toEqual('e');
        console.log(res.text);
        done();
    });

    it('missing username does not get token', async (done) => {
        const res = await request(app)
            .post('/api/login')
            .send({
                password: 'alice2'
            });

        expect(res.statusCode).toEqual(400);
        // all tokens start with e.
        expect(res.text[0]).not.toEqual('e');
        console.log(res.text);
        done();
    });

    it('missing password does not get token', async (done) => {
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'alice@ucsd.edu'
            });

        expect(res.statusCode).toEqual(400);
        // all tokens start with e.
        expect(res.text[0]).not.toEqual('e');
        console.log(res.text);
        done();
    });

    it('cannot search groups without token', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=cse210');

        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual('invalid token...');
        done();
    });

    it('can search groups with token', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=cse210')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
        done();
    });

    it('cannot get my groups without token', async (done) => {
        const res = await request(app)
            .get('/api/userJoinedGroups?email=alice@ucsd.edu')

        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual('invalid token...');
        done();
    });

    it('can get my groups with token', async (done) => {
        const res = await request(app)
            .get('/api/userJoinedGroups?email=alice@ucsd.edu')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
        done();
    });
});

