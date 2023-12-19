const fs = require("fs");
let acceptedParts = 0;

fs.readFile("data.txt", "utf-8", (_, data) => {
	solve(data.split("\r\n"));
});

const solve = (data) => {
	const workflows = parseWorkflows(data);
	const parts = parseParts(data);
	for (const part of parts) {
		part1(workflows, workflows["in"], part);
	}
	console.log(acceptedParts);
};

const part1 = (workflows, workflow, part) => {
	console.log(
		"Entered function with part: ",
		part,
		" current workflow is: ",
		workflow
	);
	for (const rule of workflow) {
		console.log("Checking rule: ", rule);
		let biggerThan = rule.search(">");
		let smallerThan = rule.search("<");
		if (biggerThan > -1) {
			console.log("Entered bigger than");
			let [key, value] = rule.split(">");
			let [val, newWorkflow] = value.split(":");
			let partVal = part[key];
			console.log("Values for bigger than: ", key, val, partVal);
			if (+partVal > +val) {
				console.log("Passed the bigger check");
				if (workflows[newWorkflow]) {
					console.log(
						"Sending part again with new workflow: ",
						newWorkflow,
						workflows[newWorkflow]
					);
					part1(workflows, workflows[newWorkflow], part);
					break;
				} else if (newWorkflow == "A") {
					console.log("new Workflow is Accept");

					console.log("Part will be added: ", part);
					for (const n of Object.values(part)) {
						acceptedParts += +n;
					}
					break;
				} else if (newWorkflow == "R") {
					break;
				}
			}
		} else if (smallerThan > -1) {
			console.log("Entered smaller than");
			let [key, value] = rule.split("<");
			let [val, newWorkflow] = value.split(":");
			let partVal = part[key];
			console.log("Values for smaller than: ", key, val, partVal);
			if (+partVal < +val) {
				console.log("Passed the smaller check");
				if (workflows[newWorkflow]) {
					console.log(
						"Sending part again with new workflow: ",
						newWorkflow,
						workflows[newWorkflow]
					);
					part1(workflows, workflows[newWorkflow], part);
					break;
				} else if (newWorkflow == "A") {
					console.log("new Workflow is Accept");
					console.log("Part will be added: ", part);
					for (const n of Object.values(part)) {
						acceptedParts += +n;
					}
					break;
				} else if (newWorkflow == "R") {
					break;
				}
			}
		} else {
			if (rule == "A") {
				console.log("Got to rule A, Part will be pushed: ", part);
				console.log("Part will be added: ", part);
				for (const n of Object.values(part)) {
					acceptedParts += +n;
				}
				break;
			}
			if (workflows[rule]) {
				console.log("Rule transfers to a new workflow: ", rule, part);
				part1(workflows, workflows[rule], part);
				break;
			} else if (rule == "R") {
				break;
			}
		}
	}
};

const parseParts = (data) => {
	let partsStart = false;
	const parts = [];
	for (let row of data) {
		if (partsStart) {
			row = row.substr(1, row.length - 2);
			let part = row.split(",");
			let partObject = {};
			for (const p of part) {
				let [a, b] = p.split("=");
				partObject[a] = b;
			}
			parts.push(partObject);
		}
		if (row == "") partsStart = true;
	}
	return parts;
};

const parseWorkflows = (data) => {
	const workflows = {};
	for (const row of data) {
		if (row == "") break;
		let [workflowName, workflow] = row.split("{");
		workflow = workflow.substr(0, workflow.length - 1);
		workflows[workflowName] = workflow.split(",");
	}
	return workflows;
};
