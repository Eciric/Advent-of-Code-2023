const fs = require("fs");

fs.readFile("data.txt", "utf-8", (_, data) => {
	data = data.split("\r\n");
	const modules = getModules(data);
	const buttonPresses = 10000;
	let lowSignalsSent = 0;
	let highSignalsSent = 0;
	let pulses = [];
	for (let i = 0; i < buttonPresses; i++) {
		let signalQueue = [
			{
				sender: "button",
				signal: false,
				recipient: modules.find(
					(module) => module.type == "broadcaster"
				),
			},
		];
		while (signalQueue.length) {
			let { sender, signal, recipient } = signalQueue.shift();
			signal ? (highSignalsSent += 1) : (lowSignalsSent += 1);

			if (!recipient) {
				continue;
			}
			if (["fh", "dd", "xp", "fc"].includes(recipient.name) && !signal) {
				if (pulses.length < 4) {
					pulses.push(i + 1);
				}
			}
			recipient.pulse(signalQueue, sender, signal);
		}
	}
	console.log(lowSignalsSent * highSignalsSent);
	console.log(LCM(pulses));
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
			outputs: row
				.split(" -> ")[1]
				.split(",")
				.map((a) => a.trim()),
			pulse: function (queue, sender, signal) {
				if (this.type == "broadcaster") {
					this.outputs.forEach((output) => {
						queue.push({
							sender: this,
							signal,
							recipient: modules.find(
								(mod) => mod.name == output
							),
						});
					});
				} else if (this.type == "flip-flop") {
					if (!signal) {
						this.status = !this.status;
						this.outputs.forEach((output) => {
							queue.push({
								sender: this,
								signal: this.status,
								recipient: modules.find(
									(mod) => mod.name == output
								),
							});
						});
					}
				} else if (this.type == "conjunction") {
					this.inputs = this.inputs.map((input) => {
						if (input.name == sender.name) {
							input.lastSignal = signal;
						}
						return input;
					});
					let newSignal = !this.inputs.every(
						(input) => input.lastSignal
					);
					this.outputs.forEach((output) => {
						queue.push({
							sender: this,
							signal: newSignal,
							recipient: modules.find(
								(mod) => mod.name == output
							),
						});
					});
				}
			},
		};
		if (module.type == "flip-flop") module["status"] = false;
		modules.push(module);
	}
	for (let module of modules) {
		let inputs = modules.filter((mod) => mod.outputs.includes(module.name));
		if (module.type == "conjunction") {
			inputs = inputs.map((input) => ({ ...input, lastSignal: false }));
		}
		module["inputs"] = inputs;
	}
	return modules;
};

const LCM = (arr) => {
	function gcd(a, b) {
		if (b === 0) return a;
		return gcd(b, a % b);
	}

	let res = arr[0];

	for (let i = 1; i < arr.length; i++) {
		res = (res * arr[i]) / gcd(res, arr[i]);
	}

	return res;
};
