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
  var db = await getDB();
  console.log("/api/findGroupsWithClassName");
  className = req.query.className;
  db.collection("groups").aggregate([
    {
      $match: {"class" : className}
    },
    {
      $lookup:{
        from: "users",
        localField: "members",
        foreignField: "_id",
        as: "members"
      }
    }, 
    {
      $project:{
        "_id":1,
        "class":1,
        "startTime":1,
        "endTime":1,
        "members.name":1,
        "members.email":1
      }
    }
   ]).toArray(function(err, result) {
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
    db.collection("groups") .aggregate([
      {
        $match:{"_id":{"$in":g_ids.joinedGroups}}
      },
      {
        $lookup:{
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members"
        }
      }, 
      {
        $project:{
          "_id":1,
          "class":1,
          "startTime":1,
          "endTime":1,
          "members.name":1,
          "members.email":1
        }
      }
     ]).toArray(function(err, result) {
      console.log(result);
      res.send(result);
    });
  });
});

module.exports = server;
