var express = require('express');
var bodyParser = require("body-parser");
var ejwt = require('express-jwt');
var jwt = require('jsonwebtoken');

var server = express();
var getDB = require('./db');

server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

server.get('/', function (req, res) {
  res.send('Hello World!');
});

server.use(ejwt({ secret: 'pxWDLMMWeBu55CARfRxZZJgZHaCYZ4a6'}).unless({path: ['/api/login', '/api/user/signup']}));
server.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).send('invalid token...');
  }
});

server.post('/api/login', async function (req, res) {
  console.log("/api/login");
  var db = await getDB();
  if (!req.body.email || !req.body.password) {
    res.status(400).send('Invalid Form');
  } else {
    const user = await db.collection("users").findOne({email: req.body.email});
    if (!user) return res.status(401).send('Unauthorized.')
    else {
      if (req.body.password != user.password) {
        return res.status(401).send('Unauthorized.')
      } else {
        const token = jwt.sign({_id: user._id}, 'pxWDLMMWeBu55CARfRxZZJgZHaCYZ4a6');
        return res.status(200).send(token);
      }   
    }
  }
});

server.get('/api/users', async function (req, res) {
  console.log("/api/users");
  var db = await getDB();
  db.collection("users").find({}).project({ _id: 0, name: 1, email: 1 }).toArray(function (err, result) {
    console.log(result);
    res.send(result);
  });
});

/**
 * Used by frontend to search for a class name
 * @params className: The classname the user is searching for
 * @returns Group[]: The groups that are held for the class.
 */
server.get('/api/findGroupsWithClassName', async function (req, res) {
  var db = await getDB();
  console.log("/api/findGroupsWithClassName");
  if (!req.query.className) {
    return res.status(400).send("Please enter a class name.")
  }
  // Convert classname to capitals no space.
  var className = req.query.className;
  className = className.replace(/\s/g, '');
  className = className.toUpperCase();


  db.collection("groups").aggregate([
    {
      $match: { $and: [{"class": className}, {"endTime": {$gte: new Date()}}] }
    },
    {
      $lookup: {
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members"
      }
    },
    {
      $project: {
        "_id": 1,
        "class": 1,
        "startTime": 1,
        "endTime": 1,
        "members.name": 1,
        "members.email": 1
      }
    },
    { $sort: { 'startTime': 1, 'members.name': 1 } },
  ]).toArray(function (err, result) {
    console.log(result);
    res.send(result);
  });
});


// TODO: This should use req.user._id instead of req.query.email, req.user._id
// will give the _id of the user the jwt is signed for. See leave group for example
server.get('/api/userJoinedGroups', async function (req, res) {
  var db = await getDB();
  email = req.query.email;
  // TODO: catch no/bad email
  console.log("received user's email:");
  console.log(email);
  db.collection("users").findOne({ "email": email }, { "joinedGroups": 1 }, function (err, g_ids) {
    db.collection("groups").aggregate([
      {
        $match: { $and: [{"_id": { "$in": g_ids.joinedGroups }}, {"endTime": {$gte: new Date()}} ] }
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members"
        }
      },
      {
        $project: {
          "_id": 1,
          "class": 1,
          "startTime": 1,
          "endTime": 1,
          "members.name": 1,
          "members.email": 1
        }
      },
      { $sort: { startTime: 1 } },
    ]).toArray(function (err, result) {
      console.log(result);
      res.send(result);
    });
  });
});

server.get('/api/leaveGroup', async function (req, res) {
  var db = await getDB();
  var groupId = parseInt(req.query.groupId);
  var userId = parseInt(req.user._id);
  console.log("received groupId:");
  console.log(groupId);
  const groupToLeaveFrom = await db.collection("groups").findOne({_id: groupId});
  if (!groupToLeaveFrom) {
    return res.status(400).send("Unknown Group");
  }
  let usersInGroupWithoutThisUser = groupToLeaveFrom.members.filter( el => el !== userId);
  groupToLeaveFrom.members = usersInGroupWithoutThisUser;
  // Save group
  await db.collection("groups").update({_id: groupId}, groupToLeaveFrom);

  const userRemoveFromGroup = await db.collection("users").findOne({_id: userId});
  if (!groupToLeaveFrom) {
    return res.status(400).send("Unknown User");
  }
  let groupsWithoutLeavingGroup = userRemoveFromGroup.joinedGroups.filter( el => el !== groupId);
  userRemoveFromGroup.joinedGroups = groupsWithoutLeavingGroup;
  // Save user
  await db.collection("users").update({_id: userId}, userRemoveFromGroup);

  res.status(200).send('Left Group')
});

server.post('/api/user/signup', async function (req, res) {
  var db = await getDB();
  console.log(`POST /api/user/signup with body ${req.body.toString()}`);
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (!name || !email || !password) {
    return res.status(400).send("Invalid Form");
  }
  // Let ID be randomly generated by mongodb
  var newUser = {
    name: name,
    email: email,
    password: password,
    joinedGroups: []
  }
  try {
    const user = await db.collection("users").insertOne(newUser);
    console.log('done')
    res.status(200).send("User successfully created.")
  } catch(err) {
    console.log(err);
    res.status(500).send("DB error");
  }
});

// Error catcher
server.use(function (err, req, res, next) {
  if (err) {
    console.log(err);
    res.status(500).send('Server Error');
  }
});

module.exports = server;
