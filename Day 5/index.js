const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, almanac) => {
	almanac = almanac.trim().split("\r\n");
	const seeds = almanac[0]
		.split(":")[1]
		.trim()
		.split(" ")
		.filter((n) => n != "")
		.map(Number);

	almanac.splice(0, 2);
	const maps = createMaps(almanac);
	let currentlyLowestValue = 0;
	const parsedSeeds = [];
	for (const seed of seeds) {
		let currentMappedValue = seed;
		for (const map of maps) {
			for (const { destinationCat, sourceCat, ranges } of map.mappings) {
				if (
					currentMappedValue >= sourceCat &&
					currentMappedValue < sourceCat + ranges
				) {
					currentMappedValue =
						destinationCat + currentMappedValue - sourceCat;
					break;
				}
			}
		}
		parsedSeeds.push(currentMappedValue);
	}
	console.log(Math.min(...parsedSeeds));
});

const createMaps = (almanac) => {
	const maps = [];
	let newMap = { name: "", mappings: [] };
	for (let [index, line] of almanac.entries()) {
		line = line.trim();
		if (line == "") {
			maps.push(newMap);
			newMap = { name: "", mappings: [] };
			continue;
		}
		if (line[line.length - 1] == ":") {
			newMap.name = line.split(" ")[0];
		} else {
			let mappingData = line
				.split(" ")
				.filter((n) => n != "")
				.map(Number);
			const mapping = {
				destinationCat: mappingData[0],
				sourceCat: mappingData[1],
				ranges: mappingData[2],
			};
			newMap.mappings.push(mapping);
		}
		if (index === almanac.length - 1) {
			maps.push(newMap);
		}
	}
	return maps;
};
