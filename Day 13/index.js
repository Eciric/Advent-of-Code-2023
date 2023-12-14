const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n"));
});

const solve = (data) => {
	const patterns = parseData(data);
	partOne(patterns);
	partTwo(patterns); // Answer too big, return to this later
};

const partTwo = (patterns) => {
	let total = 0;
	let index = 0;
	for (let pattern of patterns) {
		const [perfectHorizontal, perfectVertical] = calculatePerfects(pattern);
		let pHorizontal = undefined;
		let pVertical = undefined;
		let smudgeFound = false;
		for (let i = 0; i < pattern.length; i++) {
			if (smudgeFound) break;
			for (let j = 0; j < pattern[i].length; j++) {
				let patternCopy = structuredClone(pattern);
				if (patternCopy[i][j] == ".") patternCopy[i][j] = "#";
				else patternCopy[i][j] = ".";
				const [newPerfectHorizontal, newPerfectVertical] =
					calculatePerfects(patternCopy);
				if (
					validateNewMirrors(
						perfectHorizontal,
						newPerfectHorizontal
					) ||
					validateNewMirrors(perfectVertical, newPerfectVertical)
				) {
					console.log(index, i, j);
					smudgeFound = true;
					pHorizontal = newPerfectHorizontal;
					pVertical = newPerfectVertical;
					break;
				}
			}
		}
		if (pHorizontal) {
			total += pHorizontal.lineTwo * 100;
		} else if (pVertical) {
			total += pVertical.lineTwo;
		}
		index++;
	}
	console.log(total);
};

const partOne = (patterns) => {
	let total = 0;
	for (const pattern of patterns) {
		const horizontals = getHorizontals(pattern);
		const verticals = getVerticals(pattern);

		console.log(`Horizontals: `, horizontals);
		console.log(`Verticals: `, verticals);

		const perfectHorizontal = getHorizontalMirror(horizontals, pattern);
		const perfectVertical = getVerticalMirror(verticals, pattern);

		console.log(`Perfect horizontals: `, perfectHorizontal);
		console.log(`Perfect verticals: `, perfectVertical);

		if (perfectHorizontal) {
			total += perfectHorizontal.lineTwo * 100;
		} else if (perfectVertical) {
			total += perfectVertical.lineTwo;
		}
	}
	console.log(total);
};

const calculatePerfects = (pattern) => {
	const horizontals = getHorizontals(pattern);
	const verticals = getVerticals(pattern);

	// console.log(`Horizontals: `, horizontals);
	// console.log(`Verticals: `, verticals);

	const perfectHorizontal = getHorizontalMirror(horizontals, pattern);
	const perfectVertical = getVerticalMirror(verticals, pattern);

	// console.log(`Perfect horizontals: `, perfectHorizontal);
	// console.log(`Perfect verticals: `, perfectVertical);

	return [perfectHorizontal, perfectVertical];
};

const getHorizontals = (pattern) => {
	let horizontals = [];
	for (let i = 0; i < pattern.length - 1; i++) {
		const lineOne = pattern[i].join("");
		const lineTwo = pattern[i + 1].join("");
		if (lineOne == lineTwo) {
			horizontals.push({ lineOne: i, lineTwo: i + 1 });
		}
	}

	return horizontals;
};

const getVerticals = (pattern) => {
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
	return verticals;
};

const getHorizontalMirror = (horizontals, pattern) => {
	let perfectHorizontalMirror = undefined;
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
			perfectHorizontalMirror = { lineOne, lineTwo };
		}
	}
	return perfectHorizontalMirror;
};

const getVerticalMirror = (verticals, pattern) => {
	let perfectVerticalMirror = undefined;
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
			perfectVerticalMirror = { lineOne, lineTwo };
		}
	}
	return perfectVerticalMirror;
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

const validateNewMirrors = (perfectMirror, newPerfectMirror) => {
	if (newPerfectMirror != undefined) {
		if (perfectMirror == undefined) {
			return true;
		} else {
			if (
				perfectMirror.lineOne != newPerfectMirror.lineOne &&
				perfectMirror.lineTwo != newPerfectMirror.lineTwo
			) {
				return true;
			}
		}
	}
	return false;
};
