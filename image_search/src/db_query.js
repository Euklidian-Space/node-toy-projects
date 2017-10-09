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
      db,
      collection: db.collection("history")
    }));
}

function queryDb(req) {
  const { offset } = req.query;
  return ({ countProm, collection, db }) => {
    return countProm.then(count => {
      let n = count > offset ? offset : count;    
      let epoch = (new Date()).getTime();
      return collection.find(
        { $or: [{ when: epoch }, { when: {$lt: epoch} }] },
        { terms: 1, when: 1 }
      ).toArray()
      .then(docs => {
        db.close();
        return Promise.resolve(docs);
      });
    });
  };
}

function insert(req) {
  return connection
    .then(db => {
      let new_doc = {
        terms: req.params.keywords,
        when: (new Date()).getTime()
      };
      return db.collection("history")
        .insert(new_doc)
        .then(_data => {
          db.close();
          return Promise.resolve(new_doc);
        });
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