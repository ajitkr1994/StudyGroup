var express = require('express');
var server = express();
const MongoClient = require('mongodb').MongoClient;
var db;

server.get('/', function (req, res) {
  res.send('Hello World!');
});

server.get('/api/users', function (req, res) {
  //res.send('Hello World!');
  db.collection("users"). find({}).project({_id:0, name:1, email:1}).toArray(function(err, result) {
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
// server.listen(3000, function () {
//   console.log('Example server listening on port 3000!');
// });

const dburl = 'mongodb+srv://dbAdmin:uswPToctVp44S5aO@cluster0-yy2cw.mongodb.net/test?retryWrites=true&w=majority'
const dbclient = new MongoClient(dburl, { useUnifiedTopology: true });
dbclient.connect( (err, client) => {
  if (err) return console.log(err)
  db = client.db('testDB') // database name
  server.listen(3000, () => {
    console.log('listening on 3000')
    console.log('Database connected!')
  })
})
