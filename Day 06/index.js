const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	data = data.split("\r\n");
	const times = data[0]
		.split(":")[1]
		.trim()
		.split(" ")
		.filter((val) => val != "");
	const distances = data[1]
		.split(":")[1]
		.trim()
		.split(" ")
		.filter((val) => val != "");

	const oneTime = Number(
		times.reduce((prev, cur) => {
			return prev + cur;
		}, "")
	);
	const oneDistance = Number(
		distances.reduce((prev, cur) => {
			return prev + cur;
		}, "")
	);

	let boatSpeed = 0;
	let waysToBeat = 0;
	for (let i = 0; i < oneTime; i++) {
		if (boatSpeed * (oneTime - i) > oneDistance) {
			waysToBeat++;
		}
		boatSpeed++;
	}
	console.log(waysToBeat);
});

// Part 1
// let totalWaysToBeat = 1;
// for (const [index, time] of times.entries()) {
//     const distanceToBeat = distances[index];
//     let boatSpeed = 0;
//     const waysToBeat = [];
//     for (let i = 0; i < time; i++) {
//         if (boatSpeed * (time - i) > distanceToBeat) {
//             waysToBeat.push(boatSpeed);
//         }
//         boatSpeed++;
//     }
//     console.log(waysToBeat);
//     totalWaysToBeat *= waysToBeat.length;
// }
// console.log(totalWaysToBeat);
