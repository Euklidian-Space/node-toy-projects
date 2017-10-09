
const express = require('express');
const app = express();
const path = require('path');
const GoogleImages = require('google-images');

const { API_KEY, search_id } = require("./config/keys");
const { history } = require("./src/db_query");
const client = new GoogleImages(search_id, API_KEY);


app.get("/imagesearch/:keywords", (req, res) => {

});

app.get("/imagesearch/history", (req, res) => {
  return history(req)
    .then(docs => {
      res.json(docs);
    });
});

const port = process.env.PORT || 5000;

app.listen(port);
