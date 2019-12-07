const request = require('supertest')
const app = require('../server')
const { MongoClient } = require('mongodb');

const date1 = new Date("2020-11-26T14:12:00Z")
const date2 = new Date("2020-11-26T16:12:00Z")
const date3 = new Date("2020-11-26T18:12:00Z")
const date4 = new Date("2020-11-26T20:12:00Z")

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
            members: [],
            location: "Geisel East, 2 Floor"
        }

        Group2 = {
            _id: 2,
            class: "CSE210",
            startTime: date3,
            endTime: date4,
            members: []
        }

        Group1.members = [Alice._id, Bill._id];
        Group2.members = [Carol._id];

        Alice.joinedGroups = [Group1._id];
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

    it('should search cse210 and get back CSE210 Groups', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=cse210')
            .set('Authorization', 'Bearer ' + token);
        console.log(res.body)

        expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);
        expect(res.body[0].location).toEqual(Group1.location);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
        done();
    });

    it('should search cse 210 and get back CSE210 Groups', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=cse%20210')
            .set('Authorization', 'Bearer ' + token);
        console.log(res.body)

        expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);
        expect(res.body[0].location).toEqual(Group1.location);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
        done();
    });

    it('should search CSE 210 and get back CSE210 Groups', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=CSE%20210')
            .set('Authorization', 'Bearer ' + token);
        console.log(res.body)

        expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);
        expect(res.body[0].location).toEqual(Group1.location);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
        done();
    });

    it('should search CSE210 and get back CSE210 Groups', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=CSE210')
            .set('Authorization', 'Bearer ' + token);
        console.log(res.body)

        expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);
        expect(res.body[0].location).toEqual(Group1.location);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
        done();
    });

    it('should search CsE 210 and get back CSE210 Groups', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=CsE%20210')
            .set('Authorization', 'Bearer ' + token);
        console.log(res.body)

        expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);
        expect(res.body[0].location).toEqual(Group1.location);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
        done();
    });

    it('should search CsE210 and get back CSE210 Groups', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=CsE210')
            .set('Authorization', 'Bearer ' + token);
        console.log(res.body)

        expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);
        expect(res.body[0].location).toEqual(Group1.location);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
        done();
    });
});




describe('Search Groups Responds with Ordered Array', () => {
    let connection;
    let db;
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

        const groups = await db.collection('groups');

        /**
         * Make first group we add newer than second, other way around tested above.
         */
        Group1 = {
            _id: 1,
            class: "CSE210",
            startTime: date3,
            endTime: date4,
            members: []
        }

        Group2 = {
            _id: 2,
            class: "CSE210",
            startTime: date1,
            endTime: date2,
            members: []
        }

        await groups.insertOne(Group1);
        await groups.insertOne(Group2);
        done();
    });

    /**
     * Clear test data
     */
    afterAll(async (done) => {
        const groups = await db.collection('groups');
        await groups.deleteMany({});
        await connection.close();
        done();
    });

    it('should search cse210 and get back CSE210 Groups ordered by start date', async (done) => {
        const res = await request(app)
            .get('/api/findGroupsWithClassName?className=cse210')
            .set('Authorization', 'Bearer ' + token);
        console.log(res.body)

        expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group2._id);
        expect(res.body[0].class).toEqual(Group2.class);

        expect(res.body[1]._id).toEqual(Group1._id);
        expect(res.body[1].class).toEqual(Group1.class);
        done();
    });
});