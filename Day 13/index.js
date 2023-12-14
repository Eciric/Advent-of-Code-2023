const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n"));
});

const solve = (data) => {
	const patterns = parseData(data);
	// partOne(patterns);
	partTwo(patterns);
};

const partTwo = (patterns) => {
	let total = 0;
	for (const [index, pattern] of patterns.entries()) {
	}
};

const partOne = (patterns) => {
	let total = 0;
	for (const [index, pattern] of patterns.entries()) {
		let horizontals = [];
		for (let i = 0; i < pattern.length - 1; i++) {
			const lineOne = pattern[i].join("");
			const lineTwo = pattern[i + 1].join("");
			if (lineOne == lineTwo) {
				horizontals.push({ lineOne: i, lineTwo: i + 1 });
			}
		}

		let verticals = [];
		for (let i = 0; i < pattern[0].length - 1; i++) {
			let lineOne = "";
			let lineTwo = "";
			for (let j = 0; j < pattern.length; j++) {
				lineOne += pattern[j][i];
				lineTwo += pattern[j][i + 1];
			}
			if (lineOne == lineTwo) {
				verticals.push({ lineOne: i, lineTwo: i + 1 });
			}
		}
		// Verify perfect mirror
		const perfectMirrorHorizontals = [];
		for (const { lineOne, lineTwo } of horizontals) {
			let perfectMirror = true;
			for (
				let i = lineOne - 1, j = lineTwo + 1;
				i >= 0 && j < pattern.length;
				i--, j++
			) {
				const checkingLineOne = pattern[i].join("");
				const checkingLineTwo = pattern[j].join("");
				if (checkingLineOne != checkingLineTwo) {
					perfectMirror = false;
				}
				if (j == pattern.length - 1 && i != 0) break; // Protects from irregular lengths
			}
			if (perfectMirror) {
				perfectMirrorHorizontals.push({ lineOne, lineTwo });
			}
		}
		const perfectMirrorVerticals = [];
		for (const { lineOne, lineTwo } of verticals) {
			let perfectMirror = true;
			for (
				let i1 = lineOne - 1, i2 = lineTwo + 1;
				i1 >= 0 && i2 < pattern[0].length;
				i1--, i2++
			) {
				let checkingLineOne = "";
				let checkingLineTwo = "";
				for (let j = 0; j < pattern.length; j++) {
					checkingLineOne += pattern[j][i1];
					checkingLineTwo += pattern[j][i2];
				}
				if (checkingLineOne != checkingLineTwo) {
					perfectMirror = false;
				}
				if (i2 == pattern[0].length - 1 && i1 != 0) break; // Protects from irregular lengths
			}

			if (perfectMirror) {
				perfectMirrorVerticals.push({ lineOne, lineTwo });
			}
		}
		console.log(
			"Pattern: ",
			index,
			"Perfect Verticals: ",
			perfectMirrorVerticals,
			"Perfect horizontals: ",
			perfectMirrorHorizontals
		);
		if (perfectMirrorHorizontals.length) {
			total += perfectMirrorHorizontals[0].lineTwo * 100;
		} else if (perfectMirrorVerticals.length) {
			total += perfectMirrorVerticals[0].lineTwo;
		}
	}
	console.log(total);
};

const parseData = (data) => {
	const patterns = [];
	let pattern = [];
	for (const row of data) {
		if (row === "") {
			patterns.push(pattern);
			pattern = [];
		} else {
			pattern.push(row.split(""));
		}
	}
	return patterns;
};
