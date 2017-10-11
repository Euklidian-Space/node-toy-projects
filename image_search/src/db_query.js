const mongo = require('mongodb').MongoClient;
const { mongoURI } = require("../config/keys");

let _db;
mongo.connect(mongoURI, {
  poolSize: 5,
  autoReconnect: true,
  keepAlive: 30000,
  connectTimeoutMS: 30000
}).then(db => {
  _db = db;
});


function history(req) {
  return countDocs(req)
    .then(queryDb(req), logErr("queryDb"));
}

function countDocs() {
  return Promise.resolve({
    countPromise: _db.collection("history").count(),
    collection: _db.collection("history")
  });
}

function queryDb(req) {
  const { offset } = req.query;
  return ({ countPromise, collection }) => {
    return countPromise
      .then(count => {
        let n = count > offset ? offset : count;
        let epoch = (new Date()).getTime();
        return collection.find(
          { $or: [{ when: epoch }, { when: {$lt: epoch} }] },
          { terms: 1, when: 1, _id: 0}
        ).toArray()
        .then(docs => Promise.resolve(docs));
      });
  };
}

function insert(req) {
  let new_doc = {
    terms: req.params.keywords,
    when: (new Date()).getTime()
  };
  return _db.collection("history")
    .insert(new_doc)
    .then(_data => {
      return Promise.resolve(new_doc);
    });
}

function logErr(name, fn) {
  return err => {
    if (fn) fn();
    return Promise.reject(`Error: ${err}, in function ${name}`);
  };
}

module.exports = {
  history,
  insert
};