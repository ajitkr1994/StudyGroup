const request = require('supertest')
const app = require('../server')
const { MongoClient } = require('mongodb');

const date1 = new Date("2019-11-26T14:12:00Z")
const date2 = new Date("2019-11-26T16:12:00Z")
const date3 = new Date("2019-11-26T18:12:00Z")
const date4 = new Date("2019-11-26T20:12:00Z")

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
    beforeAll(async () => {
        connection = await MongoClient.connect(global.__MONGO_URI__, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        db = await connection.db(global.__MONGO_DB_NAME__);

        const users = db.collection('users');
        const groups = db.collection('groups');

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
        Group2.members = [Carol._id];

        Alice.joinedGroups = [Group1._id];
        Bill.joinedGroups = [Group1._id];
        Carol.joinedGroups = [Group2._id];
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
    });

    /**
     * Clear test data
     */
    afterAll(async () => {
        const users = db.collection('users');
        const groups = db.collection('groups');
        await users.deleteMany({});
        await groups.deleteMany({});
        await connection.close();
        await db.close();
    });

    it('should search cse210 and get back CSE210 Groups', async () => {
        const res = await request(app)
        .get('/api/findGroupsWithClassName?className=cse210');
        console.log(res.body)

      expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
    });

    it('should search cse 210 and get back CSE210 Groups', async () => {
        const res = await request(app)
        .get('/api/findGroupsWithClassName?className=cse%20210');
        console.log(res.body)

      expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
    });

    it('should search CSE 210 and get back CSE210 Groups', async () => {
        const res = await request(app)
        .get('/api/findGroupsWithClassName?className=CSE%20210');
        console.log(res.body)

      expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
    });

    it('should search CSE210 and get back CSE210 Groups', async () => {
        const res = await request(app)
        .get('/api/findGroupsWithClassName?className=CSE210');
        console.log(res.body)

      expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
    });

    it('should search CsE 210 and get back CSE210 Groups', async () => {
        const res = await request(app)
        .get('/api/findGroupsWithClassName?className=CsE%20210');
        console.log(res.body)

      expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
    });

    it('should search CsE210 and get back CSE210 Groups', async () => {
        const res = await request(app)
        .get('/api/findGroupsWithClassName?className=CsE210');
        console.log(res.body)

      expect(res.statusCode).toEqual(200)
        expect(res.body[0]._id).toEqual(Group1._id);
        expect(res.body[0].class).toEqual(Group1.class);
        expect(res.body[0].members[0].email).toEqual(Alice.email);
        expect(res.body[0].members[1].email).toEqual(Bill.email);

        expect(res.body[1]._id).toEqual(Group2._id);
        expect(res.body[1].class).toEqual(Group2.class);
        expect(res.body[1].members[0].email).toEqual(Carol.email);
    });
});