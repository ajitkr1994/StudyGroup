var express = require('express');
var server = express();
const MongoClient = require('mongodb').MongoClient;
var db;

server.get('/', function (req, res) {
  res.send('Hello World!');
});

server.get('/api/users', function (req, res) {
  //res.send('Hello World!');
  console.log("/api/users");
  db.collection("users"). find({}).project({_id:0, name:1, email:1}).toArray(function(err, result) {
    console.log(result);
    res.send(result);
  });
});

server.get('/api/findGroupsWithClassName', function (req, res) {
  //res.send('Hello World!');
  console.log("/api/findGroupsWithClassName");
  className = req.query.className;
  var query = {"class" : className};
  db.collection("groups"). find(query).project({_id:0 }).toArray(function(err, result) {
    console.log(result);
    res.send(result);
  });
});

server.get('/api/userJoinedGroups', function (req, res) {
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

const dburl = process.env.DBURL + "?retryWrites=true&w=majority";
console.log(dburl);
// My DB
const dbclient = new MongoClient(dburl, { useUnifiedTopology: true });
dbclient.connect( (err, client) => {
  if (err) return console.log(err)
  db = client.db() // database name, note the name is already in url, /test
  server.listen(3000, () => {
    console.log('listening on 3000')
    console.log('Database connected!')
  })
})

// Close the connection
dbclient.close();
