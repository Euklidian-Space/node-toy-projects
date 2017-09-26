const express = require('express');
const path = require('path');
const useragent = require('useragent');

const app = express();

// app.use('/scripts', express.static(__dirname + '/node_modules/clientjs/dist/'));

// app.get("/", (req, res) => {
// 	let fileName = path.join(__dirname, "static/index.html");
// 	res.sendFile(fileName, err => {
// 		if (err)
// 			res.status(err.status).end();
// 		else
// 			console.log("Sent: ", fileName);
// 	});
// });

app.get("/", (req, res) => {
	let agent = useragent.parse(req.headers["user-agent"]);
	let ip = req.ip;
	let software = agent.os.toString();
});





const port = process.env.PORT || 5000;

app.listen(port);
