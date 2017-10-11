
const express = require('express');
const app = express();
const path = require('path');
const { history, insert } = require("./src/db_query");
const { search } = require("./src/api");


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

app.get("/imagesearch/:keywords", (req, res) => {
  search(req).then(images => {
    res.json(images);
    return insert(req)
      .then(new_doc => console.log(`history updated with: ${new_doc}`))
      .catch(err => console.log(err));
  }, err => console.log(err));
});

app.get("/history", (req, res) => {
  history(req)
    .then(docs => {
      res.json(docs);
    });
});

const port = process.env.PORT || 5000;

app.listen(port);
