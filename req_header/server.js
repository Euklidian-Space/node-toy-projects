const express = require('express');
const path = require('path');
const useragent = require('useragent');

const app = express();

app.get("/", (req, res) => {
	let agent = useragent.parse(req.headers["user-agent"]);
	let ip = req.ip;
	let software = agent.os.toString();
	let lang = req.headers["accept-language"].split(",")[0];

	res.json({
		ip,
		lang,
		software
	});
});





const port = process.env.PORT || 5000;

app.listen(port);
