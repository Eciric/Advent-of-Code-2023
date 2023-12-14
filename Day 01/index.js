const fs = require("fs");
const TEXTNUMBERS = new Set([
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
]);

const TEXTCONVERSION = {
	one: 1,
	two: 2,
	three: 3,
	four: 4,
	five: 5,
	six: 6,
	seven: 7,
	eight: 8,
	nine: 9,
};

fs.readFile("data.txt", "utf8", (_, data) => {
	solve2(data.split("\r\n"));
});

const solve = (data) => {
	let sum = 0;
	for (const row of data) {
		let firstNumber = "";
		let lastNumber = "";
		for (const Number of row) {
			if (!isNaN(Number)) {
				firstNumber = Number;
				break;
			}
		}
		for (const Number of row.split("").reverse().join("")) {
			if (!isNaN(Number)) {
				lastNumber = Number;
				break;
			}
		}
		let combined = firstNumber + lastNumber;
		sum += Number(combined);
	}
	console.log(sum);
	return sum;
};

const solve2 = (data) => {
	let sum = 0;
	for (const row of data) {
		let firstNumber = "";
		let firstNumberIndex = 1;

		// First Number search

		// Look for numbers first
		for (let i = 0; i < row.length; i++) {
			if (!isNaN(row[i])) {
				firstNumber = row[i];
				firstNumberIndex = i;
				break;
			}
		}
		// Look for text numbers and swap if possible
		for (const textNumber of TEXTNUMBERS) {
			const result = row.search(textNumber);
			if (result > -1 && result < firstNumberIndex) {
				firstNumber = textNumber;
				firstNumberIndex = result;
			}
		}

		// Second Number search

		// Look for numbers first

		let lastNumber = firstNumber;
		let lastNumberIndex = firstNumberIndex;
		for (let i = row.length - 1; i > -1; i--) {
			if (!isNaN(row[i])) {
				lastNumber = row[i];
				lastNumberIndex = i;
				break;
			}
		}

		// Look for text numbers and swap if possible
		for (const textNumber of TEXTNUMBERS) {
			const indexes = [...row.matchAll(new RegExp(textNumber, "gi"))].map(
				(a) => a.index
			);
			if (indexes.length) {
				indexes.reverse();
				if (indexes[0] > lastNumberIndex) {
					lastNumber = textNumber;
					lastNumberIndex = indexes[0];
				}
			}
		}

		let combined =
			resolveNumbers(firstNumber).toString() +
			resolveNumbers(lastNumber).toString();
		sum += Number(combined);
		console.log(firstNumber, lastNumber, combined);
	}
	console.log(sum);
};

const resolveNumbers = (number) => {
	if (!isNaN(number)) return Number(number);

	if (TEXTNUMBERS.has(number)) {
		return TEXTCONVERSION[number];
	}
	return null;
};
