const request = require('supertest')
const app = require('../server')
const { MongoClient } = require('mongodb');

const date1 = new Date("2019-11-26T14:12:00Z");
const date2 = new Date("2019-11-26T16:12:00Z");
const date3 = new Date("2019-11-26T18:12:00Z");
const date4 = new Date("2019-11-26T20:12:00Z");

let token;

describe('Search Groups', () => {
    let connection;
    let db;
    let Alice;
    let Bill;
    let Carol;
    let Group1;
    let Group2;

    /**
     * Insert test data.
     */
    beforeAll(async (done) => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db(global.__MONGO_DB_NAME__);

        const users = await db.collection('users');
        const groups = await db.collection('groups');

        Alice = {
            _id: 1,
            name: "Alice",
            email: "alice@ucsd.edu",
            password: "alice",
            joinedGroups: []
        };

        Bill = {
            _id: 2,
            name: "Bill",
            email: "bill@ucsd.edu",
            password: "bill",
            joinedGroups: []
        };

        Carol = {
            _id: 3,
            name: "Carol",
            email: "carol@ucsd.edu",
            password: "carol",
            joinedGroups: []
        };

        Group1 = {
            _id: 1,
            class: "CSE210",
            startTime: date1,
            endTime: date2,
            members: []
        }

        Group2 = {
            _id: 2,
            class: "CSE210",
            startTime: date3,
            endTime: date4,
            members: []
        }

        Group1.members = [Bill._id];
        Group2.members = [Bill._id, Carol._id];

        Alice.joinedGroups = [];
        Bill.joinedGroups = [Group1._id, Group2._id];
        Carol.joinedGroups = [Group2._id];

        // Make email unique
        await db.collection('users').createIndex( { "email" : 1 }, { unique : true } );

        await users.insertOne(Alice);
        await users.insertOne(Bill);
        await users.insertOne(Carol);

        await groups.insertOne(Group1);
        await groups.insertOne(Group2);

        const insertedAlice = await users.findOne({ _id: 1 });
        const insertedBill = await users.findOne({ _id: 2 });
        const insertedCarol = await users.findOne({ _id: 3 });
        expect(insertedAlice).toEqual(Alice);
        expect(insertedBill).toEqual(Bill);
        expect(insertedCarol).toEqual(Carol);

        // LOGIN TO SET TOKEN
        const res = await request(app)
            .post('/api/login')
            .send({
                email: 'alice@ucsd.edu',
                password: 'alice'
            });

        expect(res.statusCode).toEqual(200);
        token = res.text;
        done();
    });

    /**
     * Clear test data
     */
    afterAll(async (done) => {
        const users = await db.collection('users');
        const groups = await db.collection('groups');
        await users.deleteMany({});
        await groups.deleteMany({});
        await connection.close();
        done();
    });

    it('alice join group 1', async (done) => {
        const res = await request(app)
            .post('/api/joinGroup')
            .send({groupId: 1})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)

        // Alice should be part of Group1
        const alice = await db.collection('users').findOne({_id: Alice._id});
        expect(alice.joinedGroups.length).toEqual(1);
        expect(alice.joinedGroups).toContain(Group1._id);

        // Group1 now contains Alice and Bill.
        const group1 = await db.collection('groups').findOne({_id: Group1._id});
        expect(group1.members.length).toEqual(2);
        expect(group1.members).toContain(Alice._id);
        expect(group1.members).toContain(Bill._id);

        done();
    });

    it('alice join group 1 again has no effect', async (done) => {
        const res = await request(app)
            .post('/api/joinGroup')
            .send({groupId: 1})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)
        expect(res.text).toEqual("already a member of this group");

        // Alice should be a member of Group1
        const alice = await db.collection('users').findOne({_id: Alice._id});
        expect(alice.joinedGroups.length).toEqual(1);
        expect(alice.joinedGroups).toContain(Group1._id);

        // Group1 still contains Alice and Bill.
        const group1 = await db.collection('groups').findOne({_id: Group1._id});
        expect(group1.members.length).toEqual(2);
        expect(group1.members).toContain(Alice._id);
        expect(group1.members).toContain(Bill._id);

        done();
    });

    it('alice join unknown group raise DB error', async (done) => {
        const res = await request(app)
            .post('/api/joinGroup')
            .send({groupId: 3})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("DB error");

        done();
    });

    it('calling api without groupID raise Invalid Form error', async (done) => {
        const res = await request(app)
            .post('/api/joinGroup')
            .send({})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("Invalid Form");

        done();
    });

    it('alice join group 2', async (done) => {
        const res = await request(app)
            .post('/api/joinGroup')
            .send({groupId: 2})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)

        // Alice should be a member of both Group1 and Group2
        const alice = await db.collection('users').findOne({_id: Alice._id});
        expect(alice.joinedGroups.length).toEqual(2);
        expect(alice.joinedGroups).toContain(Group1._id);
        expect(alice.joinedGroups).toContain(Group2._id);

        // Group2 contains Alice, Bill and Carol.
        const group2 = await db.collection('groups').findOne({_id: Group2._id});
        expect(group2.members.length).toEqual(3);
        expect(group2.members).toContain(Alice._id);
        expect(group2.members).toContain(Bill._id);
        expect(group2.members).toContain(Carol._id);

        done();
    });
});
