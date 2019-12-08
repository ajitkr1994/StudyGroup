const request = require('supertest')
const app = require('../server')
const { MongoClient } = require('mongodb');

const date1 = new Date("2019-11-26T14:12:00Z");
const date2 = new Date("2019-11-26T16:12:00Z");
const date3 = new Date("2019-11-26T18:12:00Z");
const date4 = new Date("2019-11-26T20:12:00Z");

let token;

describe('add chat and see chatLog in group details', () => {
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
            chatLog: [],
            location: "Geisel East, 2 Floor"
        }

        Group2 = {
            _id: 2,
            class: "CSE210",
            startTime: date3,
            endTime: date4,
            members: [],
            chatLog: []
        }

        Group1.members = [Alice._id, Bill._id];
        Group2.members = [Alice._id, Carol._id];

        Alice.joinedGroups = [Group1._id, Group2._id];
        Bill.joinedGroups = [Group1._id];
        Carol.joinedGroups = [Group2._id];

        Group1.chatLog = [
            {
                uid: Alice._id,
                content: "Let's discuss the first chapter of Mythical Man Month!",
                time: new Date("2020-11-24T20:12:00Z")
            }, 
            {
                uid: Bill._id,
                content: "Sounds good. I'll bring the book with me.",
                time: new Date("2020-11-24T20:12:40Z")
            }, 
            {
                uid: Alice._id,
                content: "Cool",
                time: new Date("2020-11-24T20:12:52Z")
            }, 
        ];

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

    it('alice chat in group 1', async (done) => {
        const chat = "Have a nice day.";
        const res = await request(app)
            .post('/api/newChat')
            .send({groupId: 1, content: chat})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)

        // Group1 now has the chat in chatLog.
        const group1 = await db.collection('groups').findOne({_id: Group1._id});
        expect(group1.chatLog.length).toEqual(4);
        expect(group1.chatLog[3].uid).toEqual(Alice._id);
        expect(group1.chatLog[3].content).toEqual(chat);
        expect(group1.chatLog[3].time).toBeTruthy();

        done();
    });

    it('alice chat in group 2', async (done) => {
        const chat = "Hello!";
        const res = await request(app)
            .post('/api/newChat')
            .send({groupId: 2, content: chat})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200)

        // Group1 now has the chat in chatLog.
        const group2 = await db.collection('groups').findOne({_id: Group2._id});
        expect(group2.chatLog.length).toEqual(1);
        expect(group2.chatLog[0].uid).toEqual(Alice._id);
        expect(group2.chatLog[0].content).toEqual(chat);
        expect(group2.chatLog[0].time).toBeTruthy();

        done();
    });

    it('alice chat in group 1 with empty content raise Invalid Form error', async (done) => {
        const res = await request(app)
            .post('/api/newChat')
            .send({groupId: 1, content: ""})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(400);
        expect(res.text).toEqual("Invalid Form");

        done();
    });

    it('alice chat in unknown group raise DB error', async (done) => {
        const chat = "Have a nice day.";
        const res = await request(app)
            .post('/api/newChat')
            .send({groupId: 3, content: chat})
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("DB error");

        done();
    });
    
    it('alice should see chatLog in group1 detail', async (done) => {
        const chat = "Have a nice day.";
        const res = await request(app)
            .get('/api/groupDetail?groupId=1')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
        console.log(JSON.stringify(res.body));

        expect(res.body._id).toEqual(Group1._id);
        expect(res.body.class).toEqual(Group1.class);
        expect(res.body.members[0].email).toEqual(Alice.email);
        expect(res.body.members[1].email).toEqual(Bill.email);
        expect(res.body.location).toEqual(Group1.location);

        expect(res.body.chatLog.length).toBe(4);

        memberIds = []
        res.body.members.forEach(member => {
            memberIds.push(member._id);
        });

        res.body.chatLog.forEach(chat => {
            expect(memberIds).toContain(chat.uid);
            expect(chat.content).toBeTruthy();
            expect(chat.time).toBeTruthy();
        });
        done();
    });

    it('alice should see chatLog in group2 detail', async (done) => {
        const chat = "Have a nice day.";
        const res = await request(app)
            .get('/api/groupDetail?groupId=2')
            .set('Authorization', 'Bearer ' + token);

        expect(res.statusCode).toEqual(200);
        console.log(JSON.stringify(res.body));

        expect(res.body._id).toEqual(Group2._id);
        expect(res.body.class).toEqual(Group2.class);
        expect(res.body.members[0].email).toEqual(Alice.email);
        expect(res.body.members[1].email).toEqual(Carol.email);

        expect(res.body.chatLog.length).toBe(1);
        
        memberIds = []
        res.body.members.forEach(member => {
            memberIds.push(member._id);
        });

        res.body.chatLog.forEach(chat => {
            expect(memberIds).toContain(chat.uid);
            expect(chat.content).toBeTruthy();
            expect(chat.time).toBeTruthy();
        });

        done();
    });
});
