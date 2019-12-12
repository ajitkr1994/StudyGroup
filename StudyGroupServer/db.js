const MongoClient = require('mongodb').MongoClient
const mongo_url = process.env.DBURL + "?retryWrites=true&w=majority";
console.log(mongo_url);

var db;
function getDB() {
    var dburl = process.env.DBURL + "?retryWrites=true&w=majority";
    if (process.env.TEST == 'true') {
        dburl = global.__MONGO_URI__;
    }
    const dbclient = new MongoClient(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    if (!db) {
    return dbclient.connect().then(client => {
        if (process.env.TEST==true) {
            return db = client.db(global.__MONGO_DB_NAME__);
        }
	db = client.db();
        return db;
    });
    } else { return db; }
}

module.exports = getDB;
