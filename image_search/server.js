
const express = require('express');
const app = express();
const path = require('path');
const { generateTinyURL, getUrl } = require("./src/verify_url");


const port = process.env.PORT || 5000;

app.listen(port);
