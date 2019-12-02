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

        Group1.members = [Alice._id, Bill._id];
        Group2.members = [Carol._id, Alice._id];

        Alice.joinedGroups = [Group1._id, Group2._id];
        Bill.joinedGroups = [Group1._id];
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

    it('alice leaves group 1', async (done) => {
        const res = await request(app)
            .get('/api/leaveGroup?groupId=1')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)

        // Alice should no longer be part of Group1
        const alice = await db.collection('users').findOne({_id: Alice._id});
        expect(alice.joinedGroups.length).toEqual(1);
        // She is still part of Group2
        expect(alice.joinedGroups[0]).toEqual(2);

        // Bill(2) should be the only user of group1.
        const group1 = await db.collection('groups').findOne({_id: Group1._id});
        expect(group1.members.length).toEqual(1);
        expect(group1.members[0]).toEqual(2);

        done();
    });

    it('alice leaves group 2 too', async (done) => {
        const res = await request(app)
            .get('/api/leaveGroup?groupId=2')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)

        // Alice should no longer be part of Group2
        const alice = await db.collection('users').findOne({_id: Alice._id});
        expect(alice.joinedGroups.length).toEqual(0);

        // Carol(3) should be the only user of group2.
        const group2 = await db.collection('groups').findOne({_id: Group2._id});
        expect(group2.members.length).toEqual(1);
        expect(group2.members[0]).toEqual(3);

        done();
    });

    it('alice leaving group1 again has no affect (unknown user)', async (done) => {
        const res = await request(app)
            .get('/api/leaveGroup?groupId=1')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)

        // Alice should no longer be part of Group1
        const alice = await db.collection('users').findOne({_id: Alice._id});
        expect(alice.joinedGroups.length).toEqual(0);

        // Bill(2) should be the only user of group1.
        const group1 = await db.collection('groups').findOne({_id: Group1._id});
        expect(group1.members.length).toEqual(1);
        expect(group1.members[0]).toEqual(2);

        done();
    });

    it('alice leaving an unknown group has no affect', async (done) => {
        const res = await request(app)
            .get('/api/leaveGroup?groupId=1')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)

        // Alice should no longer be part of Group1
        const alice = await db.collection('users').findOne({_id: Alice._id});
        expect(alice.joinedGroups.length).toEqual(0);

        // Bill(2) should be the only user of group1.
        const group1 = await db.collection('groups').findOne({_id: Group1._id});
        expect(group1.members.length).toEqual(1);
        expect(group1.members[0]).toEqual(2);

        // Carol(3) should be the only user of group2.
        const group2 = await db.collection('groups').findOne({_id: Group2._id});
        expect(group2.members.length).toEqual(1);
        expect(group2.members[0]).toEqual(3);

        done();
    });

    it('bill can leave group1 as well and nothing breaks', async (done) => {
        const billres = await request(app)
            .post('/api/login')
            .send({
                email: 'bill@ucsd.edu',
                password: 'bill'
            });

        expect(billres.statusCode).toEqual(200);
        const billtoken = billres.text;

        const res = await request(app)
            .get('/api/leaveGroup?groupId=1')
            .set('Authorization', 'Bearer ' + billtoken);

        expect(res.statusCode).toEqual(200)

        // Bill should no longer be part of Group1
        const bill = await db.collection('users').findOne({_id: Bill._id});
        expect(bill.joinedGroups.length).toEqual(0);

        // Group1 should have no users
        const group1 = await db.collection('groups').findOne({_id: Group1._id});
        expect(group1.members.length).toEqual(0);

        done();
    });
});