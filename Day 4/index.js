const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	data = data.trim().split("\r\n");
	let ans = 0;
	const cardsOfType = data.map((_, i) => 1);

	for (const [i, line] of data.entries()) {
		cardsOfType[i] += 1;
		let [winningNumbers, scratchNumbers] = line
			.split(":")[1]
			.trim()
			.split("|")
			.map((el) =>
				el
					.trim()
					.split(" ")
					.filter((num) => num != "")
					.map(Number)
			);

		const cross = winningNumbers.filter((number) =>
			scratchNumbers.includes(number)
		);
		if (cross.length) {
			ans += 2 ** (cross.length - 1);
			for (let j = 0; j < cross.length; j++) {
				cardsOfType[i + 1 + j] += cardsOfType[i];
			}
		}
	}
	console.log(
		ans,
		Object.values(cardsOfType).reduce((prev, cur) => prev + cur, 0) / 2
	);
});
