const mongo = require('mongodb').MongoClient;
const { mongoURI } = require("../config/keys");
const connection = mongo.connect(mongoURI);


function history(req) {
  return countDocs(req)
    .then(queryDb(req), logErr("queryDb"));
}

function countDocs() {
  return connection
    .then(db => Promise.resolve({
      countProm: db.collection("history").count(),
      collection: db.collection("history")
    }));
}

function queryDb(req) {
  const { offset } = req.query;
  return ({ countProm, collection }) => {
    return countProm.then(count => {
      let n = count > offset ? count - offset : count;    
      return collection.find(
        { $or: [{ order_id: n }, { order_id: {$lt: n} }] },
        { url: 1, snippet: 1, thumbnail: 1, context: 1}
      ).toArray();
    });
  };
}

function logErr(name, fn) {
  return err => {
    if (fn) fn();
    return Promise.reject(`Error: ${err}, in function ${name}`);
  };
}