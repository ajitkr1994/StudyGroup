var express = require('express');
var server = express();
var getDB = require('./db');

server.get('/', function (req, res) {
  res.send('Hello World!');
});

server.get('/api/users', async function (req, res) {
  console.log("/api/users");
  var db = await getDB();
  db.collection("users"). find({}).project({_id:0, name:1, email:1}).toArray(function(err, result) {
    console.log(result);
    res.send(result);
  });
});

server.get('/api/findGroupsWithClassName', async function (req, res) {
  //res.send('Hello World!');
  var db = await getDB();
  console.log("/api/findGroupsWithClassName");
  className = req.query.className;
  var query = {"class" : className};
  db.collection("groups"). find(query).project({_id:0 }).toArray(function(err, result) {
    console.log(result);
    res.send(result);
  });
});

server.get('/api/userJoinedGroups', async function (req, res) {
  var db = await getDB();
  email = req.query.email;
  console.log("received user's email:");
  console.log(email);
  db.collection("users"). findOne({"email":email}, {"joinedGroups":1}, function(err, g_ids){
    db.collection("groups"). find({"_id":{"$in":g_ids.joinedGroups}}).toArray(function(err, result) {
      membernames = db.collection("users"). findOne()
      console.log(result);
      res.send(result);
    });
  });
});

module.exports = server;
