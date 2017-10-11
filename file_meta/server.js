
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const upload = multer();

app.get("/", (req, res) => {
  let fileName = path.join(__dirname, "static/index.html");

  res.sendFile(fileName, err => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log("Sent: ", fileName);
    }
  });
});

app.get("/upload", (req, res) => {
  let fileName = path.join(__dirname, "static/form.html");

  res.sendFile(fileName, err => {
    if (err) {
      console.log(err);
      res.status(err.status).end();
    } else {
      console.log("Sent: ", fileName);
    }
  });
});

app.post("/new_file", upload.single("file"), (req, res) => {
  let { originalname, size } = req.file
  res.json({
    file: originalname, 
    size
  })
});

const port = process.env.PORT || 5000;

app.listen(port);
