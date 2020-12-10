const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// Generic employee questions
const quesGeneral = [
    {
        type: "input",
        name: "name",
        message: "Name:"
    },
    {
        type: "input",
        name: "id",
        message: "ID:",
        validate: validateId
    },
    {
        type: "input",
        name: "email",
        message: "E-mail:",
        validate: validateEmail
    },
    {
        type: "list",
        name: "role",
        message: "Role:",
        choices: [
            "Manager",
            "Engineer",
            "Intern"
        ]
    }
]

// Questions by role
const quesManager = [
    {
        type: "input",
        name: "officeNumber",
        message: "Office Number:",
        validate: validateOffice
    }
];
const quesEngineer = [
    {
        type: "input",
        name: "github",
        message: "GitHub:"
    }
];
const quesIntern = [
    {
        type: "input",
        name: "school",
        message: "School:"
    }
];

// Loop check question
const quesLoop = [
    {
        type: "confirm",
        name: "check",
        message: "Add another employee?"
    }
];

var employees;

async function main() {
    employees = [];
    do {
        console.log("Employee info:");
        employees.push(await getEmployee());
    } while (await loopCheck());
    output(render(employees));
}

// Prompt for info and return employee object
async function getEmployee() {
    let roleData;
    let genData = await inquirer.prompt(quesGeneral);
    switch (genData.role) {
        case "Manager":
            roleData = await inquirer.prompt(quesManager);
            return new Manager(genData.name, genData.id, genData.email, roleData.officeNumber);
        case "Engineer":
            roleData = await inquirer.prompt(quesEngineer);
            return new Engineer(genData.name, genData.id, genData.email, roleData.github);
        case "Intern":
            roleData = await inquirer.prompt(quesIntern);
            return new Intern(genData.name, genData.id, genData.email, roleData.school);
    }
    throw new Error("Role not specified");
}

// Ask user if another user is to be added
function loopCheck() {
    return inquirer.prompt(quesLoop)
        .then(response => {
            console.log("");
            return response.check;
        });
}

// Validate number
function validateNumber(n) {
    n = parseInt(n);
    return !isNaN(n);
}

// Validate IDs as unique numbers
function validateId(id) {
    return validateNumber(id) && employees.every(e => e.getId() != id) ? true : "IDs must be unique numbers";
}

// Validate proper E-mail format
function validateEmail(email) {
    let result = email.match(/[a-z0-9._\-]+@[a-z0-9._\-]+\.[a-z0-9._\-]+/i);
    return result && result[0] === email ? true : "Invalid E-mail address";
}

// Validate office number as number
function validateOffice(officeNumber) {
    return validateNumber(officeNumber) || "Invalid office number";
}

// Create output folder if need be and write to file
function output(data) {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR);
    }
    fs.promises.writeFile(outputPath, data).then(() => {
        console.log(`Output file: ${outputPath}`);
    }).catch(console.error);
}

main();
