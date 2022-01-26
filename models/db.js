const { MongoClient } = require('mongodb')

const connectionUrl = 'mongodb+srv://challengeUser:WUMglwNBaydH8Yvu@challenge-xzwqd.mongodb.net/getircase-study?retryWrites=true';
const dbName = 'getir-case-study';

let db = null;

const init = async () =>{
  client = await MongoClient.connect(connectionUrl, { useNewUrlParser: true });
  db = client.db(dbName);
}

const getItems = async () => {
  const collection = db.collection('records');
  const records = await collection.find({}).toArray();
  return records;
}

module.exports = { init, getItems }
