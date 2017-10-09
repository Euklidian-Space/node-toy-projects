const mongo = require('mongodb').MongoClient;
const Validator = require("valid-url");
const shortID = require('shortid');
const { mongoURI } = require("../config/keys");

const connection = mongo.connect(mongoURI);

function generateTinyURL(req) {
  return verifyURL(req, logErr("verifyURL"))
    .then(queryUrl(connection), logErr("queryUrl"))
    .then(parseQueryResponse(req), logErr("parseQueryResponse"));
}

function getUrl(req) {
  return connection
    .then(db => {
      let col = db.collection("url_list");
      return col
        .find(
        { _id: req.params.id },
        { url: 1, _id: 0 }
      ).toArray().then(docs => {
        db.close();
        console.log("doc", docs);
        if (docs[0]) {
          return Promise.resolve(docs[0].url);
        } else {
          throw new Error("ID not found");
        }
      });
    });
}

function verifyURL(req) {
  return Promise.resolve({
    then: function(resolve) {
      if (Validator.isUri(req.params.url)) {
        resolve({
          req
        });
      } else {
        throw new Error("Invalid URL");
      }
    }
  });
};

function queryUrl(connection) {
  return ({ req }) => {
    console.log("opening db...");
    return connection.then(db => {
      let col = db.collection("url_list");
      return col
        .find(
          { url: req.params.url },
          { _id: 1, url: 1, tiny_url: 1 }
        ).toArray()
        .then(docs => Promise.resolve({col, docs, db}));
    });
  };
}

function parseQueryResponse(req) {
  return ({ col, docs, db }) => {
    if (docs[0]) {
      console.log("closing db");
      db.close();
      return Promise.resolve({
        url: docs[0].url,
        tiny_url: docs[0].tiny_url
      });
    } 
    let id = shortID.generate();
    let tiny_url = `http://${req.headers['host']}/ret/${id}`;
    let new_doc = {
    url: req.params.url,
      tiny_url,
      _id: id
    };
    return col.insert(new_doc).then(data => {
      let { ops } = data;
      let { url, tiny_url } = ops[0];
      console.log("closing db");
      db.close();
      return Promise.resolve({ url, tiny_url });
    });
  };
}

function logErr(name, fn) {
  return err => {
    if (fn) fn();
    return Promise.reject(`Error: ${err}, in function ${name}`);
    }
}

module.exports = {
	generateTinyURL,
	getUrl
};
