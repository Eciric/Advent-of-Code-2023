const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	data = data.trim().split("\r\n");
	let ans = 0;
	const cardsOfType = data.map(() => 1);

	data.forEach((line, i) => {
		cardsOfType[i] += 1;
		const [winningNumbers, scratchNumbers] = line
			.split(":")[1]
			.trim()
			.split("|")
			.map((el) =>
				el
					.trim()
					.split(" ")
					.filter((num) => num !== "")
					.map(Number)
			);

		const cross = winningNumbers.filter((number) =>
			scratchNumbers.includes(number)
		);
		if (cross.length) {
			ans += 2 ** (cross.length - 1);
			cross.forEach((_, j) => {
				cardsOfType[i + 1 + j] += cardsOfType[i];
			});
		}
	});

	console.log(ans, cardsOfType.reduce((prev, cur) => prev + cur, 0) / 2);
});
