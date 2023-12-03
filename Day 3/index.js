const fs = require("fs");

const partNumbers = [];
const gears = [];

const SYMBOLS = new Set(["@", "#", "$", "%", "&", "*", "+", "-", "=", "/"]);

const solve = (data) => {
	for (const [index, row] of data.entries()) {
		let numFlag = false;
		for (let i = 0; i < row.length; i++) {
			if (!isNaN(row[i]) && !numFlag) {
				const found = checkNeighbours(index, i, data);
				if (found) {
					const num = getNumberAt(index, i, data);
					partNumbers.push(num);
					numFlag = true;
				}
			}

			if (isNaN(row[i])) {
				numFlag = false;
			}
		}
	}
	console.log(
		partNumbers.reduce((prev, cur) => {
			return prev + Number(cur);
		}, 0)
	);
};

const solve2 = (data) => {
	for (const [index, row] of data.entries()) {
		const starIndexes = [...row.matchAll(new RegExp("\\*", "gi"))].map(
			(a) => a.index
		);
		for (const i of starIndexes) {
			let occurences = findOccurences(index, i, data);
			if (occurences.length === 2) {
				gears.push([
					getNumberAt(occurences[0].row, occurences[0].col, data),
					getNumberAt(occurences[1].row, occurences[1].col, data),
				]);
			}
		}
	}

	let sum = 0;
	for (const gear of gears) {
		sum += Number(gear[0]) * Number(gear[1]);
	}
	console.log(sum);

	fs.writeFile("output.txt", JSON.stringify(gears), "utf-8", () => {});
};

// Returns true if a bordering symbol is found
const checkNeighbours = (row, col, data) => {
	const rows = data.length;
	const cols = data[0].length;
	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			const newRow = row + y;
			const newCol = col + x;

			// Check if the new indices are within bounds
			if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
				if (SYMBOLS.has(data[newRow][newCol])) {
					return true;
				}
			}
		}
	}
	return false;
};

const findOccurences = (row, col, data) => {
	const rows = data.length;
	const cols = data[0].length;
	const occurences = [];
	for (let x = -1; x <= 1; x++) {
		for (let y = -1; y <= 1; y++) {
			const newRow = row + y;
			const newCol = col + x;

			// Check if the new indices are within bounds
			if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
				if (!isNaN(data[newRow][newCol])) {
					let alreadyExists = occurences.find((val) => {
						if (val.row == newRow) {
							const separatedByStar = checkSeparation(
								val.row,
								val.col,
								newCol,
								data
							);
							if (separatedByStar) return false;
						}

						const sameNumber =
							getNumberAt(newRow, newCol, data) ==
							getNumberAt(val.row, val.col, data);

						if (val.row == newRow && sameNumber) return true;

						return false;
					});
					if (!alreadyExists) {
						occurences.push({
							row: newRow,
							col: newCol,
						});
					}
				}
			}
		}
	}
	return occurences;
};

const checkSeparation = (row, col1, col2, data) => {
	const startCol = col1 > col2 ? col2 : col1;
	const endCol = col1 > col2 ? col1 : col2;

	let separated = false;
	for (let y = startCol; y <= endCol; y++) {
		if (data[row][y] == "*") {
			separated = true;
		}
	}
	return separated;
};

const getNumberAt = (row, col, data) => {
	let number = "";
	let startingCol = -1;

	for (let i = col; i >= 0; i--) {
		if (isNaN(data[row][i])) {
			startingCol = i + 1;
			break;
		}

		if (i === 0 && !isNaN(data[row][i])) {
			startingCol = 0;
			break;
		}
	}

	for (let i = startingCol; i <= data[row].length; i++) {
		if (isNaN(data[row][i])) break;

		number += data[row][i];
	}

	return number;
};

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve2(data.split("\r\n"));
});
