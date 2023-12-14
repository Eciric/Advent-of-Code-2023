const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n").map((row) => row.split("")));
});

const solve = (data) => {
	partOne(data);
	partTwo(data);
};

const partOne = (data) => {
	tiltNorth(data);
	calculateLoad(data);
};

const partTwo = (data) => {
	// No need to do 1B cycles it aligns anyway
	for (let i = 0; i < 1000; i++) {
		cycle(data);
	}
	calculateLoad(data);
	fs.writeFile(
		"output.txt",
		JSON.stringify(data.map((row) => row.join(""))),
		() => {}
	);
};

const cycle = (data) => {
	tiltNorth(data);
	tiltWest(data);
	tiltSouth(data);
	tiltEast(data);
};

const calculateLoad = (data) => {
	data = data.map((row) => row.join(""));
	let load = 0;
	for (const [i, row] of data.entries()) {
		for (const cell of row) {
			if (cell == "O") {
				load += data.length - i;
			}
		}
	}
	console.log(load);
};

const tiltNorth = (data) => {
	data = data.reverse();
	let titls = 1;
	while (titls) {
		titls = 0;
		for (let i = 0; i < data.length - 1; i++) {
			for (let j = 0; j < data[i].length; j++) {
				const cell = data[i][j];
				const cellBelow = data[i + 1][j];
				if (cell === "O" && cellBelow === ".") {
					data[i][j] = ".";
					data[i + 1][j] = "O";
					titls++;
				}
			}
		}
	}
	data = data.reverse();
};

const tiltSouth = (data) => {
	let titls = 1;
	while (titls) {
		titls = 0;
		for (let i = 0; i < data.length - 1; i++) {
			for (let j = 0; j < data[i].length; j++) {
				const cell = data[i][j];
				const cellBelow = data[i + 1][j];
				if (cell === "O" && cellBelow === ".") {
					data[i][j] = ".";
					data[i + 1][j] = "O";
					titls++;
				}
			}
		}
	}
};

const tiltEast = (data) => {
	let titls = 1;
	while (titls) {
		titls = 0;
		for (let i = 0; i < data.length; i++) {
			for (let j = 0; j < data[i].length - 1; j++) {
				const cell = data[i][j];
				const cellRight = data[i][j + 1];
				if (cell === "O" && cellRight === ".") {
					data[i][j] = ".";
					data[i][j + 1] = "O";
					titls++;
				}
			}
		}
	}
};

const tiltWest = (data) => {
	let titls = 1;
	while (titls) {
		titls = 0;
		for (let i = 0; i < data.length; i++) {
			for (let j = data[i].length - 1; j > 0; j--) {
				const cell = data[i][j];
				const cellLeft = data[i][j - 1];
				if (cell === "O" && cellLeft === ".") {
					data[i][j] = ".";
					data[i][j - 1] = "O";
					titls++;
				}
			}
		}
	}
};
