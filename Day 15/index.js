const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n"));
});

const solve = (data) => {
	const row = data[0];
	const lenses = row.split(",");
	let sum = calculate(lenses);
	console.log(sum);

	const boxes = Array.from({ length: 256 }, () => []);
	for (const lense of lenses) {
		if (lense.includes("=")) {
			let [rawLabel, focalLength] = lense.split("=");
			let label = calculate([lense.split("=")[0]]);
			let index = boxes[label].findIndex((val) => {
				return val.rawLabel == rawLabel;
			});
			if (index > -1) {
				boxes[label][index].focalLength = focalLength;
			} else {
				boxes[label].push({ rawLabel, focalLength });
			}
		} else if (lense.includes("-")) {
			let rawLabel = lense.split("-")[0];
			let label = calculate([lense.split("-")[0]]);
			let index = boxes[label].findIndex((val) => {
				return val.rawLabel == rawLabel;
			});
			if (index > -1) {
				boxes[label].splice(index, 1);
			}
		}
	}
	console.log(
		boxes.reduce(
			(focusingPower, box, boxIndex) =>
				(focusingPower += box.reduce(
					(acc, lense, lenseIndex) =>
						(acc +=
							(1 + boxIndex) *
							(lenseIndex + 1) *
							+lense.focalLength),
					0
				)),
			0
		)
	);
};

const calculate = (lenses) => {
	return lenses.reduce((totalSum, word) => {
		return (totalSum += word.split("").reduce((total, letter) => {
			return (total = ((letter.charCodeAt() + total) * 17) % 256);
		}, 0));
	}, 0);
};
