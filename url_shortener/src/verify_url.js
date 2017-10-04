const mongo = require('mongodb').MongoClient;
const Validator = require("valid-url");
const shortID = require('shortid');
const { mongoURI } = require("../config/keys");

const connection = mongo.connect(mongoURI);

function generateTinyURL(req, res) {
	verifyURL(req, res)
		.then(queryUrl(connection), logErr(res))
		.then(parseQueryResponse({ req, res }), logErr(res))
		.then(results({ req, res }))
		.catch(logErr(res));
}


function verifyURL(req, res) {
	return Promise.resolve({
		then: function(resolve) {
			if (Validator.isUri(req.params.url)) {
				resolve({
					req,
					res
				});
			} else {
				throw new Error("Invalid URL");
			}
		}
	});
};

// function queryUrl(connection) {
// 	return ({ req, res }) => {
// 		return connection
// 			.then(db => {
// 				return db.collection("url_list")
// 					.find(
// 						{ url: req.params.url },
// 						{ _id: 1, url: 1, tiny_url: 1}
// 					).toArray();
// 			});
// 	};
// }

function queryUrl(connection) {
	return ({ req, res }) => {
		return connection.then(db => {
			let docs = db.collection("url_list")
									.find(
										{ url: req.params.url },
										{ _id: 1, url: 1, tiny_url }
									).toArray();
			return Promise.resolve({docs, db});
		});
	};
}

// function queryUrl(connection) {
// 	return ({ req, res }) => {
// 		return Promise.resolve({
// 			then: function (resolve) {
// 				resolve({
// 					docs:
// 				})
// 			}
// 		})
// 	};
// }

function parseQueryResponse({ req, res }) {
	return ({ docs, db }) => {
		if (docs[0]) {
			return Promise.resolve({
				then: function (resolve) {
					resolve({
						data : {
							url: docs[0].url,
							tiny_url: docs[0].tiny_url
						},
						db
					});
				}
			});
		} else {
			let tiny_url = `http://${req.headers['host']}/${shortID.generate()}`;
			let new_doc = {
				url: req.params.url,
				tiny_url
			};
			return db.insert(new_doc).then(data => Promise.resolve({ data, db }));
		}
	};
}

function results({ req, res }) {
	return ({ data, db }) => {
		res.json(data);
		db.close();
	}
}

function logErr(res) {
	return err => res.send(console.log(err));
}

module.exports = {
	generateTinyURL
};
