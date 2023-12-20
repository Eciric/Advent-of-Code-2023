const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n").map((row) => row.split("")));
});

const solve = (grid) => {
	const graph = constructGraph(grid);
};

const constructGraph = (grid) => {
	const graph = [];
	for (const [x, row] of grid.entries()) {
		for (const [y, _] of row.entries()) {
			let neighbours = {};
			if (x > 0) {
				neighbours[`${x - 1},${y}`] = grid[x - 1][y];
			}
			if (x < grid.length - 1) {
				neighbours[`${x + 1},${y}`] = grid[x + 1][y];
			}
			if (y > 0) {
				neighbours[`${x},${y - 1}`] = grid[x][y - 1];
			}
			if (y < grid[0].length - 1) {
				neighbours[`${x},${y + 1}`] = grid[x][y + 1];
			}
			graph.push(`${x},${y}`, neighbours);
		}
	}
	return graph;
};
