const express = require('express');
const app = express();

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


const port = process.end.PORT || 5000;

app.listen(port);
