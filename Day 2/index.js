const fs = require("fs");

const RULES = { red: 12, green: 13, blue: 14 };
const games = [];

const solve = (data) => {
	parseGames2(data.split("\r\n"));
};

const parseGames = (data) => {
	let gameIndex = 0;
	for (const row of data) {
		gameIndex++;
		let gameFailed = false;
		let gameData = row.split(":")[1];
		let sets = gameData.split(";");
		for (const set of sets) {
			let values = set.split(",").map((val) => val.trim());
			for (const value of values) {
				let [dice, color] = value.split(" ");
				if (dice > RULES[color]) {
					gameFailed = true;
				}
			}
		}
		games.push({ game: gameIndex, status: gameFailed });
	}
	console.log(
		games.reduce((prev, cur) => {
			if (cur.status === false) {
				return prev + cur.game;
			} else return prev;
		}, 0)
	);
};

const parseGames2 = (data) => {
	let gameIndex = 0;
	for (const row of data) {
		gameIndex++;
		let gameData = row.split(":")[1];
		let sets = gameData.split(";");
		let biggestValuesOfSet = { red: 0, green: 0, blue: 0 };
		for (const set of sets) {
			let values = set.split(",").map((val) => val.trim());
			for (const value of values) {
				let [dice, color] = value.split(" ");
				if (Number(dice) > Number(biggestValuesOfSet[color])) {
					biggestValuesOfSet[color] = dice;
				}
			}
		}
		games.push({ game: gameIndex, biggestValuesOfSet });
	}
	let sum = 0;
	for (const game of games) {
		let { red, green, blue } = game.biggestValuesOfSet;
		sum += red * green * blue;
	}
	console.log(sum);
};

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data);
});
