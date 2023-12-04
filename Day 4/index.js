const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.trim().split("\r\n"));
});

const solve = (data) => {
	let parsedCards = parseCards(data);
	// countPoints(parsedCards);
	duplicateCards(parsedCards);
};

const parseCards = (cards) => {
	const parsedCards = [];
	for (const card of cards) {
		let row = card.split(":")[1];
		let [winningNumbers, scratchNumbers] = row.trim().split("|");

		parsedCards.push({
			winningNumbers: new Set(formatCardNumbers(winningNumbers)),
			scratchNumbers: new Set(formatCardNumbers(scratchNumbers)),
		});
	}
	return parsedCards;
};

const countPoints = (cards) => {
	let totalPoints = 0;
	for (const card of cards) {
		let cardPoints = 0;
		for (const winningNumber of card.winningNumbers) {
			if (card.scratchNumbers.has(winningNumber)) {
				cardPoints ? (cardPoints *= 2) : (cardPoints = 1);
			}
		}
		totalPoints += cardPoints;
	}
	console.log(totalPoints);
};

const formatCardNumbers = (numbers) => {
	return numbers
		.trim()
		.split(" ")
		.filter((num) => num != "")
		.map(Number);
};

const duplicateCards = (cards) => {
	const cardsOfType = {};
	for (const [i, card] of cards.entries()) {
		cardsOfType[i] = 1;
	}
	for (let i = 0; i < cards.length; i++) {
		cardsOfType[i] += 1;

		let cardsToDuplicate = 0;
		for (const winningNumber of cards[i].winningNumbers) {
			if (cards[i].scratchNumbers.has(winningNumber)) {
				cardsToDuplicate++;
			}
		}

		for (let j = 0; j < cardsToDuplicate; j++) {
			cardsOfType[i + 1 + j] += cardsOfType[i];
		}
	}
	console.log(
		Object.values(cardsOfType).reduce((prev, cur) => {
			return prev + cur;
		}, 0) / 2
	);
};
