const pool = require('./db/index');
const inquirer = require('inquirer');
const myMap = require('./helpers/selectionLogic');
const drawLogo = require('./helpers/logo');

async function main() {
    await inquirer
    .prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'selection',
        choices: [
            'Exit Employee Manager',
            new inquirer.Separator(),
            'View All Employees',
            'View Total Utilized Budget Of A Department',
            'View Employee By Department',
            'View Employee By Manager',
            'View All Roles',
            'View All Department',
            new inquirer.Separator(),
            'Add Employees',
            'Add Role',
            'Add Department',
            new inquirer.Separator(),
            'Update Employee Role',
            'Update Employee Manager',
            new inquirer.Separator(),
            'Delete Department(s)',
            'Delete Role(s)',
            'Delete Employee(s)',
            new inquirer.Separator(),
        ],
    })
    .then(async (answer) => {
        //iterates through map of functions, the keys are the name of the choices
        const selection = myMap.get(answer.selection);
        await selection(pool);
        main();
    })
}

drawLogo();
main();
