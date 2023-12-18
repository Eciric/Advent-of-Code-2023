const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n"));
});

const solve = (data) => {
	// part1(data);
	console.log(part2(data));
};

const part2 = (data) => {
	let totalArea = 0;
	let border = 1;
	let currentPos = [0, 0];
	for (const row of data) {
		let [_, distance, color] = row.split(" ");
		color = color.substr(2, color.length - 3);
		let newDir = color.at(color.length - 1);
		let direction =
			newDir == 0 ? "R" : newDir == 1 ? "D" : newDir == 2 ? "L" : "U";
		distance = parseInt(color.substr(0, color.length - 1), 16);
		let nextPos = [0, 0];
		switch (direction) {
			case "R":
				nextPos = [currentPos[0] + distance, currentPos[1]];
				break;

			case "L":
				nextPos = [currentPos[0] - distance, currentPos[1]];
				break;

			case "U":
				nextPos = [currentPos[0], currentPos[1] - distance];
				break;

			case "D":
				nextPos = [currentPos[0], currentPos[1] + distance];
				break;

			default:
				console.log("Wrong direction");
		}
		border += distance / 2;
		totalArea +=
			(currentPos[0] * nextPos[1] - currentPos[1] * nextPos[0]) / 2;
		currentPos = nextPos;
	}
	return Math.abs(totalArea) + border;
};

const part1 = (data) => {
	let totalArea = 0;
	let border = 1;
	let currentPos = [0, 0];
	for (const row of data) {
		let [direction, distance] = row.split(" ");
		distance = +distance;
		let nextPos = [0, 0];
		switch (direction) {
			case "R":
				nextPos = [currentPos[0] + distance, currentPos[1]];
				break;

			case "L":
				nextPos = [currentPos[0] - distance, currentPos[1]];
				break;

			case "U":
				nextPos = [currentPos[0], currentPos[1] - distance];
				break;

			case "D":
				nextPos = [currentPos[0], currentPos[1] + distance];
				break;

			default:
				console.log("Wrong direction");
		}
		border += distance / 2;
		totalArea +=
			(currentPos[0] * nextPos[1] - currentPos[1] * nextPos[0]) / 2;
		currentPos = nextPos;
	}
	return Math.abs(totalArea) + border;
};
