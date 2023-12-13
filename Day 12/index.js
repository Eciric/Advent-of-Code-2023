const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	data = data.split("\r\n").map((row) => {
		let [springs, sections] = row.split(" ");
		springs = new Array(5)
			.fill()
			.map(() => springs)
			.join("?");
		sections = new Array(5)
			.fill()
			.map(() => sections)
			.join(",");
		return springs + " " + sections;
	});
	const parsedData = [];
	for (const row of data) {
		const [springs, sections] = row.split(" ");
		parsedData.push({ springs, sections: sections.split(",").map(Number) });
	}

	let totalArrangements = 0;
	for (const [i, row] of parsedData.entries()) {
		let currentIndex = 0;
		let arrangements = {
			count: 0,
		};
		parseLine(row.springs, currentIndex, row.sections, arrangements);
		totalArrangements += arrangements.count;
		console.log("Completed row: ", i);
	}
	console.log(totalArrangements);
});

const parseLine = (line, currentIndex, sections, arrangements) => {
	if (currentIndex > line.length) return 0;

	if (noQuestionMarksLeft(line)) {
		if (meetsDemands(line, sections)) {
			arrangements.count += 1;
		}
		return 0;
	}

	if (line[currentIndex] === "?") {
		line = line.split("");
		line[currentIndex] = ".";
		line = line.join("");
		parseLine(line, currentIndex + 1, sections, arrangements);
		line = line.split("");
		line[currentIndex] = "#";
		line = line.join("");
		parseLine(line, currentIndex + 1, sections, arrangements);
	} else {
		parseLine(line, currentIndex + 1, sections, arrangements);
	}

	return 0;
};

const noQuestionMarksLeft = (line) => {
	for (const letter of line) {
		if (letter === "?") {
			return false;
		}
	}
	return true;
};

const meetsDemands = (line, sections) => {
	let sectionsCopy = [...sections];
	let lineCopy = { line };
	for (const section of sectionsCopy) {
		const nextSection = getNextSectionLength(lineCopy);
		if (nextSection.length === section) {
			continue;
		} else {
			return false;
		}
	}
	if (getNextSectionLength(lineCopy) != "") return false;
	return true;
};

const getNextSectionLength = (line) => {
	const firstOccurence = line.line.search("#");
	if (firstOccurence === -1) return "";
	let section = "";
	let dotIndex = -1;
	for (let i = firstOccurence; i < line.line.length; i++) {
		if (line.line[i] === ".") {
			dotIndex = i;
			break;
		}
		section += line.line[i];
	}
	if (dotIndex != -1) {
		line.line =
			line.line.substring(0, firstOccurence) +
			line.line.substring(dotIndex, line.length);
	} else {
		line.line = line.line.substring(0, firstOccurence);
	}
	return section;
};

//???.### 1,1,3
//.??.###
//..?.###
//....### 3
//..#.### 1,3
//.#?.###
//.#..### 1,3
//.##.### 2,3
//#??.###
//#.?.###
//#...### 1,3
//#.#.### 1,1,3 -> Solution, recursive calls for each combination?
//##?.###
//##..### 2,3
//###.### 3,3

// Call method with line, if no question marks left return line up the call stack
// If question mark spotted call the method again twice for when ? is replaced with . and #
