const express = require('express');
const app = express();
const path = require('path');
const { generateTinyURL, getUrl } = require("./src/verify_url");


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

app.get("/new/:url(*)", (req, res) => {
	generateTinyURL(req)
		.then(data => res.json(data))
		.catch(err => res.send(console.log(err)));
});

app.get("/ret/:id", (req, res) => {
  getUrl(req)
    .then(url => {
      console.log(`redirecting to ${url}...`);
      res.redirect(301, url);
    }).catch(err => res.send(console.log(err)));
});

const port = process.env.PORT || 5000;

app.listen(port);
