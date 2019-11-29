const MongoClient = require('mongodb').MongoClient
const mongo_url = process.env.DBURL + "?retryWrites=true&w=majority";
console.log(mongo_url);

function getDB() {
    var dburl = process.env.DBURL + "?retryWrites=true&w=majority";
    if (process.env.TEST == 'true') {
        dburl = global.__MONGO_URI__;
    }
    const dbclient = new MongoClient(dburl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    return dbclient.connect().then(client => {
        if (process.env.TEST==true) {
            return db = client.db(global.__MONGO_DB_NAME__);
        }
        return db = client.db();
    });
}

module.exports = getDB;