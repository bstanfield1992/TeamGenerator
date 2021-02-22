// Variables
const inquirer = require("inquirer");
const fs = require("fs");
const style = require("./templates/css");
const Employee = require("./lib/employee");
const Engineer = require("./lib/engineer");
const Manager = require("./lib/manager");
const Intern = require("./lib/intern");
let finalTeamArray = [];

function startingPrompt() {
    inquirer.prompt([
        {
            message: "Please write your team name: ",
            name: "teamname"
        }
    ])
        .then(function(data){
            const teamName = data.teamname
            finalTeamArray.push(teamName)
            addManager();
        })

    
}

function addManager() {
    inquirer.prompt([
        {
            name: "name" ,
            type: "input" ,
            message: "What is your team manager's name?"
        },
        {
            name: "email" ,
            type: "input" ,
            message: "What is your team manager's email address?"
        },
        {
            name: "officeNumber" ,
            type: "number",
            message: "What is your team manager's office number?"
        },
    ])

        .then(function (data) {
            const name = data.name
            const id = 1
            const email = data.email
            const officeNumber = data.officeNumber
            const teamMember = new Manager(name, id, email, officeNumber)
            finalTeamArray.push(teamMember)
            addTeamMembers();
        });

}

function addTeamMembers() {
    inquirer.prompt([
        {
            name: "addMemberData" ,
            type: "list",
            message: "Would you like to add more team members?",
            choices: ["Yes, add an engineer", "Yes, add an intern", "No, my team is complete"]
        }
    ])
    .then(function (data) {

        switch (data.addMemberData) {
            case "Yes, add an engineer":
                addEngineer();
                break;

            case "Yes, add an intern":
                addIntern();
                break;
            case "No, my team is complete":
                compileTeam();
                break;
        }
    });
}

function addEngineer() {
    inquirer.prompt([
        {
            name: "name" ,
            type: "input" ,
            message: "What is this engineer's name?"

        },
        {
            name: "email" ,
            type: "input" ,
            message: "What is this engineer's email address?"
        },
        {
            name: "github" ,
            type: "input" ,
            message: "What is this engineer's Github profile?"
        }
    ])

        .then(function (data) {
            const name = data.name
            const id = finalTeamArray.length + 1
            const email = data.email
            const github = data.github
            const teamMember = new Engineer(name, id, email, github)
            finalTeamArray.push(teamMember)
            addTeamMembers()
        });

};

function addIntern() {
    inquirer.prompt([
        {
            name: "name" ,
            type: "input" ,
            message: "What is this intern's name?"
        },
        {
            name: "email" ,
            type: "input" ,
            message: "What is this intern's email address?"
        },
        {
            name: "school" ,
            type: "input" ,
            message: "What is this intern's school?"
        }
    ])

        .then(function (data) {
            const name = data.name
            const id = finalTeamArray.length + 1
            const email = data.email
            const school = data.school
            const teamMember = new Intern(name, id, email, school)
            finalTeamArray.push(teamMember)
            addTeamMembers()
        });

};

function compileTeam() {
    console.log("successfully created html")

    const htmlArray = []
    const htmlBeginning = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${finalTeamArray[0]}</title>
    <link href="https://fonts.googleapis.com/css?family=Bebas+Neue&display=swap" rel="stylesheet">
    <style>
     ${style}
    </style>
</head>
<body>
    <div class="banner-bar">
        <h1>${finalTeamArray[0]}</h1>
    </div>
    <div class="card-container">
    `
    htmlArray.push(htmlBeginning);

    for (let i = 1; i < finalTeamArray.length; i++) {
        let object = `
        <div class="member-card">
            <div class="card-top">
                <h2>${finalTeamArray[i].name}</h2>
                <h2>${finalTeamArray[i].title}</h2>
            </div>
            <div class="card-bottom">
                <p>Employee ID: ${finalTeamArray[i].id}</p>
                <p>Email: <a href="mailto:${finalTeamArray[i].email}" target="">${finalTeamArray[i].email}</a></p>
        `
        if (finalTeamArray[i].officeNumber) {
            object += `
            <p>OfficeNumber: ${finalTeamArray[i].officeNumber}</p>
            `
        }
        if (finalTeamArray[i].github) {
            object += `
            <p>GitHub: <a href="https://github.com/${finalTeamArray[i].github}" target="">${finalTeamArray[i].github}</a></p>
            `
        }
        if (finalTeamArray[i].school) {
            object += `
            <p>School: ${finalTeamArray[i].school}</p>
            `
        }
        object += `
        </div>
        </div>
        `
        htmlArray.push(object)
    }

    const htmlEnd = `
    </div>
    </body>
    </html>
    `
    htmlArray.push(htmlEnd);

    fs.writeFile(`./generated-html/${finalTeamArray[0]}.html`, htmlArray.join(""), function (err) {
        
    })
}

startingPrompt()