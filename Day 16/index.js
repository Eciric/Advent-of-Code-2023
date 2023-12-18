const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n"));
});

const solve = (grid) => {};
