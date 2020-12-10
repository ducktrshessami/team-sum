const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs").promises;

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
        type: "number",
        name: "officeNumber",
        message: "Office Number:"
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
    console.log(employees);
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

function loopCheck() {
    return inquirer.prompt(quesLoop)
        .then(response => response.check);
}

function validateId(id) {
    id = parseInt(id);
    return !isNaN(id) && employees.every(e => e.getId() !== id) ? true : "IDs must be unique numbers";
}

function validateEmail(email) {
    let result = email.match(/[a-z0-9._\-]+@[a-z0-9._\-]+.[a-z0-9._\-]+/i);
    return result && result[0] === email ? true : "Invalid E-mail address";
}

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```

main();
