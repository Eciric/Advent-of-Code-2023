const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(
		data.split("\r\n").map((row) =>
			row
				.split(" ")
				.filter((el) => el !== "")
				.map(Number)
		)
	);
});

const solve = (data) => {
	partOne(data);
	partTwo(data);
};

const partOne = (data) => {
	const map = parseMap(data);

	for (const line of Object.entries(map)) {
		const dataset = line[0].split(",");
		const histories = line[1];
		histories.unshift(dataset.map(Number));
		for (let i = histories.length - 1; i >= 0; i--) {
			let elementToPush = 0;
			if (i !== histories.length - 1) {
				let bottomElement =
					histories[i + 1][histories[i + 1].length - 1];
				let leftElement = histories[i][histories[i].length - 1];
				elementToPush = Number(bottomElement) + Number(leftElement);
			} else {
				elementToPush = histories[i][histories[i].length - 1];
			}
			histories[i].push(elementToPush);
		}
	}
	let sum = 0;
	for (const line of Object.entries(map)) {
		sum += line[1][0].at(-1);
	}
	console.log(sum);
};

const areAllValuesZero = (arr) => {
	if (arr.length === 0) return false;
	let flag = true;
	for (const val of arr) {
		if (val != 0) {
			flag = false;
			break;
		}
	}
	return flag;
};

const partTwo = (data) => {
	const map = parseMap(data);
	for (const line of Object.entries(map)) {
		const dataset = line[0].split(",");
		const histories = line[1];
		histories.unshift(dataset.map(Number));
		for (let i = histories.length - 1; i >= 0; i--) {
			let elementToPush = 0;
			if (i !== histories.length - 1) {
				let bottomElement = histories[i + 1][0];
				let leftElement = histories[i][0];
				elementToPush = Number(leftElement) - Number(bottomElement);
			} else {
				elementToPush = histories[i][histories[i].length - 1];
			}
			histories[i].unshift(elementToPush);
		}
	}
	let sum = 0;
	for (const line of Object.entries(map)) {
		sum += line[1][0].at(0);
	}
	console.log(sum);
};

const parseMap = (data) => {
	const map = {};
	for (const line of data) {
		map[line] = [];
	}

	for (const line of Object.entries(map)) {
		const dataset = line[0].split(",");
		const history = line[1];
		let tempDataset = dataset;
		let tempHistory = [];
		while (!areAllValuesZero(tempHistory)) {
			tempHistory = [];
			for (let i = 0; i < tempDataset.length - 1; i++) {
				tempHistory.push(
					Number(tempDataset[i + 1]) - Number(tempDataset[i])
				);
			}
			history.push(tempHistory);
			tempDataset = tempHistory;
		}
	}
	return map;
};
