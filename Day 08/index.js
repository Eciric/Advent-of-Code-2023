const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	data = data.split("\r\n");
	const instructions = data[0];
	data.splice(0, 2);
	let nodes = {};
	for (const line of data) {
		const node = line.split(" = ");
		nodes[node[0]] = node[1].slice(1, node[1].length - 1).split(", ");
	}

	partTwo(instructions, nodes);
});

const partOne = (instructions, nodes) => {
	let currentNode = "AAA";
	let searchingNode = "ZZZ";
	let steps = 0;
	let instructionIndex = 0;
	while (currentNode != searchingNode) {
		if (instructionIndex + 1 > instructions.length) {
			instructionIndex = 0;
		}
		let currentInstruction = instructions[instructionIndex];
		let nodeValues = nodes[currentNode];
		if (currentInstruction == "R") {
			currentNode = nodeValues[1];
		} else {
			currentNode = nodeValues[0];
		}
		steps++;
		instructionIndex++;
	}
	console.log(steps);
};

const partTwo = (instructions, nodes) => {
	let currentNodes = [];
	for (const node of Object.entries(nodes)) {
		let lastChar = node[0][2];
		if (lastChar === "A") {
			currentNodes.push(node[0]);
		}
	}
	let stepsArr = [];
	for (let node of currentNodes) {
		let steps = 0;
		while (node[2] !== "Z") {
			node =
				instructions[steps % instructions.length] === "L"
					? nodes[node][0]
					: nodes[node][1];
			steps++;
		}
		stepsArr.push(steps);
	}
	console.log(stepsArr);
	console.log(LCM(stepsArr));
};

const LCM = (arr) => {
	function gcd(a, b) {
		if (b === 0) return a;
		return gcd(b, a % b);
	}

	let res = arr[0];

	for (let i = 1; i < arr.length; i++) {
		res = (res * arr[i]) / gcd(res, arr[i]);
	}

	return res;
};
