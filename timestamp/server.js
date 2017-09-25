const express = require('express');
const path = require('path');


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

app.get("/:date", (req, res) => {
  let { date } = req.params;
  let new_date, unix;
  if (date.match(/[0-9]/).length === date.length) {
    unix = date;
    new_date = new Date(parseInt(date));
  } else {
    unix = Date.parse(date);
    new_date = new Date(date);
  }

  res.json({
    unix,
    natural: new_date
  });
});


const port = process.env.PORT || 5000;

app.listen(port);
