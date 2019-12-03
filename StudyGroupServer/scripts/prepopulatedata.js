var date1 = new Date("2020-11-26T14:12:00Z")
var date2 = new Date("2020-11-26T16:12:00Z")
var date3 = new Date("2020-11-26T18:12:00Z")
var date4 = new Date("2020-11-26T20:12:00Z")

var Alice = {
    _id:1,
    name  : "Alice",
    email : "alice@ucsd.edu",
    password: "alice",
    joinedGroups: []
};

var Bill = {
    _id:2,
    name  : "Bill",
    email : "bill@ucsd.edu",
    password: "bill",
    joinedGroups: []
};

var Carol = {
    _id:3,
    name  : "Carol",
    email : "carol@ucsd.edu",
    password: "carol",
    joinedGroups: []
};

var Group1 = {
    _id:1,
    class : "CSE210",
    startTime: date1,
    endTime: date2,
    members: []
}

var Group2 = {
    _id:2,
    class : "CSE202",
    startTime: date3,
    endTime: date4,
    members: []
}

Group1.members = [Alice._id, Bill._id];
Group2.members = [Alice._id, Carol._id];

Alice.joinedGroups = [Group1._id, Group2._id];
Bill.joinedGroups = [Group1._id];
Carol.joinedGroups = [Group2._id];

db.users.insert(Alice);
db.users.insert(Bill);
db.users.insert(Carol);

db.groups.insert(Group1);
db.groups.insert(Group2);