const fs = require("fs");

const solve = (data) => {
	let emptyRows = getEmptyRows(data);
	let emptyColumns = getEmptyColumns(data);
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
