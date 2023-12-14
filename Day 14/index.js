const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n").map((row) => row.split("")));
});

const solve = (data) => {
	data = data.reverse();
	let totalMovements = 1;
	while (totalMovements) {
		totalMovements = 0;
		for (let i = 0; i < data.length - 1; i++) {
			for (let j = 0; j < data[i].length; j++) {
				const cell = data[i][j];
				const cellBelow = data[i + 1][j];
				if (cell === "O" && cellBelow === ".") {
					data[i][j] = ".";
					data[i + 1][j] = "O";
					totalMovements++;
				}
			}
		}
	}
	data = data.reverse().map((row) => row.join(""));
	let weight = 0;
	for (const [i, row] of data.entries()) {
		for (const cell of row) {
			if (cell == "O") {
				weight += data.length - i;
			}
		}
	}
	console.log(weight);
};
