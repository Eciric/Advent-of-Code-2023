const fs = require("fs");

let lookupMap;
fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n").map((row) => row.split("")));
});

const solve = (map) => {
	let visited = [];
	let nodes = [];
	let viableSTiles = ["|", "-", "L", "J", "7", "F"];
	const lookFor = (arr) => {
		return visited.some((item) => item[0] === arr[0] && item[1] === arr[1]);
	};
	const intersects = (arr) => {
		return viableSTiles.filter((value) => arr.includes(value));
	};

	let startPos = getStartPos(map);
	visited.push(startPos);
	nodes.push(startPos);

	while (nodes.length) {
		const [x, y] = nodes.shift();
		const tile = map[x][y];
		if (
			x > 0 &&
			"S|JL".includes(tile) &&
			"|7F".includes(map[x - 1][y]) &&
			!lookFor([x - 1, y])
		) {
			visited.push([x - 1, y]);
			nodes.push([x - 1, y]);
			if (tile === "S") {
				viableSTiles = intersects(["|", "J", "L"]);
			}
		}

		if (
			x < map.length - 1 &&
			"S|7F".includes(tile) &&
			"|JL".includes(map[x + 1][y]) &&
			!lookFor([x + 1, y])
		) {
			visited.push([x + 1, y]);
			nodes.push([x + 1, y]);
			if (tile === "S") {
				viableSTiles = intersects(["|", "7", "F"]);
			}
		}

		if (
			y > 0 &&
			"S-J7".includes(tile) &&
			"-LF".includes(map[x][y - 1]) &&
			!lookFor([x, y - 1])
		) {
			visited.push([x, y - 1]);
			nodes.push([x, y - 1]);
			if (tile === "S") {
				viableSTiles = intersects(["-", "J", "7"]);
			}
		}

		if (
			y < map[0].length - 1 &&
			"S-LF".includes(tile) &&
			"-J7".includes(map[x][y + 1]) &&
			!lookFor([x, y + 1])
		) {
			visited.push([x, y + 1]);
			nodes.push([x, y + 1]);
			if (tile === "S") {
				viableSTiles = intersects(["-", "F", "L"]);
			}
		}
	}
	console.log("part 1 solution:", visited.length / 2);
	map[startPos[0]][startPos[1]] = viableSTiles[0];
	for (let i = 0; i < map.length; i++) {
		for (let j = 0; j < map[0].length; j++) {
			if (!lookFor([i, j])) {
				map[i][j] = ".";
			}
		}
	}

	const outside = [];
	for (const [x, row] of map.entries()) {
		let within = false;
		let up = undefined;
		for (const [y, ch] of row.entries()) {
			if (ch == "|") {
				within = !within;
			} else if ("LF".includes(ch)) {
				up = ch == "L";
			} else if ("7J".includes(ch)) {
				if (ch != (up ? "J" : "7")) {
					within = !within;
				}
				up = undefined;
			}
			if (!within) {
				outside.push([x, y]);
			}
		}
	}
	const merged = [];
	for (const el of outside) {
		merged.push(el);
	}
	for (const el of visited) {
		if (!merged.some((item) => item[0] == el[0] && item[1] == el[1])) {
			merged.push(el);
		}
	}
	console.log(
		"part 2 solution: ",
		map.length * map[0].length - merged.length
	);
};

const getStartPos = (data) => {
	let startCoords = [];
	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].length; j++) {
			if (data[i][j] === "S") {
				startCoords = [i, j];
			}
		}
	}
	return startCoords;
};
