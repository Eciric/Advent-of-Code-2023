const fs = require("fs");
const offset = 10;
let dist_offset = 0;
const solve = (data) => {
	let emptyRows = getEmptyRows(data);
	let emptyColumns = getEmptyColumns(data);
	console.log(emptyRows, emptyColumns);
	dist_offset = (emptyRows.length + emptyColumns.length) * offset;
	// for (const row of data) {
	// 	process.stdout.write(row + "\n");
	// }

	const galaxies = getGalaxies(data);

	const distances = getDistances(galaxies, emptyRows, emptyColumns);
	console.log(
		distances.reduce((acc, cur) => {
			return (acc += cur.distance);
		}, 0)
	);
};

const getDistances = (galaxies, emptyRows, emptyCols) => {
	const distances = [];
	let scale = 1000000;
	for (const firstGalaxy of galaxies) {
		let dist = 0;
		for (const secondGalaxy of galaxies) {
			if (firstGalaxy.name != secondGalaxy.name) {
				if (
					!distances.some((dist) => {
						return (
							(dist.firstGalaxy.name === firstGalaxy.name &&
								dist.secondGalaxy.name === secondGalaxy.name) ||
							(dist.firstGalaxy.name === secondGalaxy.name &&
								dist.secondGalaxy.name === firstGalaxy.name)
						);
					})
				) {
					let lowerRow = Math.min(firstGalaxy.x, secondGalaxy.x);
					let higherRow = Math.max(firstGalaxy.x, secondGalaxy.x);
					let lowerCol = Math.min(firstGalaxy.y, secondGalaxy.y);
					let higherCol = Math.max(firstGalaxy.y, secondGalaxy.y);
					for (let i = lowerRow; i < higherRow; i++) {
						dist += emptyRows.includes(i) ? scale : 1;
					}
					for (let i = lowerCol; i < higherCol; i++) {
						dist += emptyCols.includes(i) ? scale : 1;
					}
					distances.push({
						firstGalaxy: firstGalaxy,
						secondGalaxy: secondGalaxy,
						distance: dist,
					});

					dist = 0;
				}
			}
		}
	}
	return distances;
};

const getGalaxies = (data) => {
	const galaxies = [];
	let galaxy_id = 0;
	for (const [x, row] of data.entries()) {
		let y = 0;
		for (const cell of row) {
			if (cell === "#") {
				galaxies.push({
					name: ++galaxy_id,
					x,
					y,
				});
			}
			y++;
		}
	}
	return galaxies;
};

const addEmptyRows = (data, emptyRowsIndexes) => {
	for (const emptyRowsIndex of emptyRowsIndexes.reverse()) {
		const rowToDuplicate = data[emptyRowsIndex];
		console.log(emptyRowsIndex, rowToDuplicate);
		data.splice(emptyRowsIndex, 0, rowToDuplicate);
	}
};

const addEmptyCols = (data, emptyColsIndexes) => {
	for (let [index, row] of data.entries()) {
		for (let i = row.length - 1; i >= 0; i--) {
			if (emptyColsIndexes.includes(i)) {
				row = row.substring(0, i) + "." + row.substring(i, row.length);
				data[index] = row;
			}
		}
	}
};

const getEmptyRows = (data) => {
	const emptyRows = [];
	for (const [i, row] of data.entries()) {
		let emptyCells = 0;
		for (const cell of row) {
			if (cell === ".") emptyCells++;
		}
		if (emptyCells === row.length) {
			emptyRows.push(i);
		}
	}
	return emptyRows;
};

const getEmptyColumns = (data) => {
	const emptyColumns = [];
	for (let i = 0; i < data.length; i++) {
		let emptyCells = 0;
		for (let j = 0; j < data[i].length; j++) {
			if (data[j][i] === ".") emptyCells++;
		}
		if (emptyCells === data.length) {
			emptyColumns.push(i);
		}
	}
	return emptyColumns;
};

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.trim().split("\r\n"));
});
