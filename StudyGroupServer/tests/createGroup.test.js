const request = require('supertest')
const app = require('../server')
const { MongoClient } = require('mongodb');

describe('Create group', () => {
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
        const groups = db.collection('groups');
        await groups.deleteMany({});
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

    
    it('can create group with token', async (done) => {
        const date1 = new Date("2020-11-26T14:12:00Z");
        const date2 = new Date("2020-11-26T16:12:00Z");
        const res = await request(app)
            .post('/api/createGroup')
            .set('Authorization', 'Bearer ' + token)
            .send({
                className: "CSE210",
                startTime: date1.toISOString(),
                endTime: date2.toISOString()
            });

        expect(res.statusCode).toEqual(200);
        const insertedGroup = await db.collection('groups').findOne({ className: 'CSE210' });
        expect(insertedGroup.id).not.toBeNull();
        expect(insertedGroup.startTime).toEqual(date1);
        expect(insertedGroup.endTime).toEqual(date2);
        expect(insertedGroup.members).toEqual([1]);
        const inserdAlice = await db.collection('users').findOne({ _id: 1 });
        expect(inserdAlice.joinedGroups).toContainEqual(insertedGroup._id);
        done();
    });


    it('cannot create group without token', async (done) => {
        const date1 = new Date("2020-11-26T14:12:00Z");
        const date2 = new Date("2020-11-26T16:12:00Z");
        const res = await request(app)
            .post('/api/createGroup')
            .send({
                className: "CSE210",
                startTime: date1.toISOString(),
                endTime: date2.toISOString()
            });

        expect(res.statusCode).toEqual(401);
        expect(res.text).toEqual('invalid token...');
        done();
    });


    it('should convert class name to upper case no space', async (done) => {
        const date3 = new Date("2020-11-26T18:12:00Z");
        const date4 = new Date("2020-11-26T20:12:00Z");
        const res = await request(app)
            .post('/api/createGroup')
            .set('Authorization', 'Bearer ' + token)
            .send({
                className: "CsE 202",
                startTime: date3.toISOString(),
                endTime: date4.toISOString()
            });

        expect(res.statusCode).toEqual(200);
        console.log("create group 200");
        const insertedGroup = await db.collection('groups').findOne({ className: 'CSE202' });
        expect(insertedGroup.id).not.toBeNull();
        expect(insertedGroup.startTime).toEqual(date3);
        expect(insertedGroup.endTime).toEqual(date4);
        expect(insertedGroup.members).toEqual([1]);
        const inserdAlice = await db.collection('users').findOne({ _id: 1 });
        expect(inserdAlice.joinedGroups).toContainEqual(insertedGroup._id);
        done();
    });

    
    it('cannot create group without startTime', async (done) => {
        const date2 = new Date("2020-11-26T16:12:00Z");
        const res = await request(app)
            .post('/api/createGroup')
            .send({
                className: "CSE232",
                endTime: date2.toISOString()
            })
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(400);
        const insertedGroup = await db.collection('groups').findOne({ className: 'CSE232' });
        expect(insertedGroup).toBeNull();
        done();
    });

    
    it('cannot create group without className', async (done) => {
        const date2 = new Date("2020-11-26T16:12:00Z");
        const date3 = new Date("2020-11-26T18:12:00Z");
        const res = await request(app)
            .post('/api/createGroup')
            .send({
                startTime: date2.toISOString(),
                endTime: date3.toISOString()
            })
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(400);
        const insertedGroup = await db.collection('groups').findOne({ startTime: date2 });
        expect(insertedGroup).toBeNull();
        done();
    });

});

