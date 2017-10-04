const express = require('express');
const app = express();
const path = require('path');
const { generateTinyURL } = require("./src/verify_url");


app.get("/", (req, res) => {
  let fileName = path.join(__dirname, "static/index.html");

  res.sendFile(fileName, err => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log("Sent:", fileName);
    }
  });
});

app.get("/new/:url", (req, res) => {
	generateTinyURL(req, res);
});


const port = process.env.PORT || 5000;

app.listen(port);

// function queryUrl({ req, res }) {
// 	return connection
// 		.then(db => {
// 			return db.collection("url_list")
// 				.find(
// 					{ url:  req.params.url},
// 					{ _id: 1, url: 1, tiny_url: 1}
// 				).toArray()
// 		})
// 		.then(docs => {
// 			if (docs[0]) {
// 				return Promise.resolve({
// 					then: function (resolve) {
// 						resolve({
// 							url: docs[0].url,
// 							tiny_url: docs[0].tiny_url
// 						});
// 					}
// 				});
// 			} else {
// 				let tiny_url = `http://${req.headers['host']}/${shortID.generate()}`;
// 				let new_doc = {
// 					url,
// 					tiny_url
// 				};
// 				return db.insert(new_doc);
// 			}
// 		}, err => res.send(console.log(err)))
// 		.then(data => {
// 			res.json(data);
// 			db.close();
// 		});
// }
