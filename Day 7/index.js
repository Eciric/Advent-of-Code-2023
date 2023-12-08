const fs = require("fs");

const CARDTYPES = {
	"High card": 0,
	"One pair": 1,
	"Two pair": 2,
	"Three of a kind": 3,
	"Full house": 4,
	"Four of a kind": 5,
	"Five of a kind": 6,
};

const CARDPOWER = [
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"T",
	"J",
	"Q",
	"K",
	"A",
];

const CARDPOWERWITHJOKERS = [
	"J",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"T",
	"Q",
	"K",
	"A",
];

let JOKERS = true;

fs.readFile("data.txt", "utf-8", (_, data) => {
	data = data.split("\r\n");

	const hands = [];
	for (const line of data) {
		const [hand, bidAmount] = line.split(" ");
		hands.push({ hand, bid: Number(bidAmount) });
	}

	hands.sort((hand1, hand2) => {
		if (
			getHandType(getHandPower(hand1.hand)) <
			getHandType(getHandPower(hand2.hand))
		)
			return -1;
		if (
			getHandType(getHandPower(hand1.hand)) >
			getHandType(getHandPower(hand2.hand))
		)
			return 1;
		return sortByCardPower(hand1.hand, hand2.hand);
	});

	console.log(
		hands.reduce((prevHand, curHand, i) => {
			return (prevHand += curHand.bid * (i + 1));
		}, 0)
	);
});

const sortByCardPower = (hand1, hand2) => {
	const cardSet = JOKERS ? CARDPOWERWITHJOKERS : CARDPOWER;
	for (let i = 0; i < hand1.length; i++) {
		if (cardSet.indexOf(hand1[i]) < cardSet.indexOf(hand2[i])) {
			return -1;
		}
		if (cardSet.indexOf(hand1[i]) > cardSet.indexOf(hand2[i])) {
			return 1;
		}
	}
	return 0;
};

const getHandPower = (hand) => {
	let cards = hand.split("");
	let jokers = 0;
	if (JOKERS) {
		cards = cards.filter((card) => {
			if (card === "J") {
				jokers++;
				return false;
			}
			return true;
		});
	}
	const handCards = cards.reduce((prev, cur) => {
		if (prev[cur]) {
			prev[cur] += 1;
		} else {
			prev[cur] = 1;
		}
		return prev;
	}, {});

	const sortedCards = Object.values(handCards).sort((hand1, hand2) => {
		return hand2 - hand1;
	});

	// Jokers always turn into the most common card
	if (jokers) {
		sortedCards[0] += jokers;
		if (jokers === 5) {
			sortedCards[0] = 5;
		}
	}
	return sortedCards;
};

const getHandType = (handPower) => {
	if (handPower[0] == 5) {
		return CARDTYPES["Five of a kind"];
	}
	if (handPower[0] == 4) {
		return CARDTYPES["Four of a kind"];
	}
	if (handPower[0] == 3) {
		if (handPower[1] == 2) {
			return CARDTYPES["Full house"];
		} else {
			return CARDTYPES["Three of a kind"];
		}
	}
	if (handPower[0] == 2) {
		if (handPower[1] == 2) {
			return CARDTYPES["Two pair"];
		} else {
			return CARDTYPES["One pair"];
		}
	}
	if (handPower[0] == 1) {
		return CARDTYPES["High card"];
	}
};
