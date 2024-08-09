const inquirer = require('inquirer');
const Employee = require('../models/employee');
const myMap = require('../helpers/selectionLogic');

module.exports = async function startPrompt(pool) {
    var exit = false;
    const myChoices = [
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
    ];
    while(!exit){
        await inquirer
        .prompt({
            type: 'list',
            message: 'What would you like to do?',
            name: 'selection',
            choices: myChoices
        })
        .then((answer) => {
            const useMe = myMap.get(answer.selection)
            useMe(pool);
        })
    }

}