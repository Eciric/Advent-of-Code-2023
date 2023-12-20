const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	data = data.split("\r\n");
	const modules = getModules(data);
	const buttonPresses = 1000;
	let lowSignalsSent = 0;
	let highSignalsSent = 0;
	for (let i = 0; i < buttonPresses; i++) {
		console.log("----------------------------");
		let signalQueue = [
			{ signalType: "low", sender: "button", recipient: modules[10] },
		];
		lowSignalsSent++;
		while (signalQueue.length) {
			let { signalType, sender, recipient } = signalQueue.shift();
			let samePrioritySignals = signalQueue.filter(
				(sig) => sig.sender == sender
			);
			samePrioritySignals.unshift({ signalType, sender, recipient });
			let newStartIndex = samePrioritySignals.length;
			signalQueue = signalQueue.slice(
				newStartIndex - 1,
				signalQueue.length
			);

			for (const {
				signalType,
				sender,
				recipient,
			} of samePrioritySignals) {
				if (recipient == undefined) {
					console.log(
						sender,
						`-${signalType}->`,
						"module doesnt exist"
					);
					signalType == "low"
						? (lowSignalsSent += 1)
						: (highSignalsSent += 1);
					continue;
				}
				console.log(sender, `-${signalType}->`, recipient.name);

				if (recipient.type == "broadcaster") {
					for (const destModule of recipient.destModules) {
						signalQueue.push({
							signalType,
							sender: recipient.name,
							recipient: modules.find(
								(module) => module.name == destModule
							),
						});
						signalType == "low"
							? (lowSignalsSent += 1)
							: (highSignalsSent += 1);
					}
				} else if (recipient.type == "flip-flop") {
					if (signalType == "high") continue;
					else if (signalType == "low") {
						let newStatus =
							recipient.status == "off" ? "on" : "off";
						let newSignal =
							recipient.status == "off" ? "high" : "low";
						modules[
							modules.findIndex(
								(module) => module.name == recipient.name
							)
						].status = newStatus;
						for (const destModule of recipient.destModules) {
							signalQueue.push({
								signalType: newSignal,
								sender: recipient.name,
								recipient: modules.find(
									(module) => module.name == destModule
								),
							});
							newSignal == "low"
								? (lowSignalsSent += 1)
								: (highSignalsSent += 1);
						}
					}
				} else if (recipient.type == "conjunction") {
					if (recipient.inputs.length == 1) {
						let newSignal = signalType == "low" ? "high" : "low";
						for (const destModule of recipient.destModules) {
							signalQueue.push({
								signalType: newSignal,
								sender: recipient.name,
								recipient: modules.find(
									(module) => module.name == destModule
								),
							});
							newSignal == "low"
								? (lowSignalsSent += 1)
								: (highSignalsSent += 1);
						}
						recipient.inputs[0].lastSignal = signalType;
					} else {
						for (let input of recipient.inputs) {
							if (input.name == sender) {
								input.lastSignal = signalType;
							}
						}

						if (allInputsHigh(recipient.inputs)) {
							for (const destModule of recipient.destModules) {
								signalQueue.push({
									signalType: "low",
									sender: recipient.name,
									recipient: modules.find(
										(module) => module.name == destModule
									),
								});
								lowSignalsSent++;
							}
						} else {
							for (const destModule of recipient.destModules) {
								signalQueue.push({
									signalType: "high",
									sender: recipient.name,
									recipient: modules.find(
										(module) => module.name == destModule
									),
								});
								highSignalsSent++;
							}
						}
					}
				}
			}
		}
	}
	console.log(
		lowSignalsSent,
		highSignalsSent,
		lowSignalsSent * highSignalsSent
	);
});

const getModules = (data) => {
	const modules = [];
	for (const row of data) {
		let name = row.split(" -> ")[0];
		if (name[0] != "b") name = name.substr(1, name.length);
		let module = {
			name: name.trim(),
			type:
				row[0] == "b"
					? "broadcaster"
					: row[0] == "%"
					? "flip-flop"
					: "conjunction",
			destModules: row
				.split(" -> ")[1]
				.split(",")
				.map((a) => a.trim()),
		};
		if (module.type == "flip-flop") {
			module["status"] = "off";
		}
		modules.push(module);
	}
	for (let module of modules) {
		if (module.type == "conjunction") {
			let inputs = modules.filter((mod) =>
				mod.destModules.includes(module.name)
			);
			inputs = inputs.map((input) => ({ ...input, lastSignal: "low" }));
			module["inputs"] = inputs;
		}
	}
	return modules;
};

const allInputsHigh = (inputs) => {
	for (const input of inputs) {
		if (input.lastSignal == "low") return false;
	}
	return true;
};
