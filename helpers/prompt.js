const inquirer = require('inquirer');
const Employee = require('../models/employee');
const myMap = require('../helpers/selectionLogic');

module.exports = async function startPrompt(pool) {
    var exit = false;
    const myChoices = [
        'Exit Employee Manager',
        'View All Employees',
        'Add Employees',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Department',
        'Add Department',
        'View Employee By Department',
        'View Employee By Manager',
        'Update Employee Manager',
        'Delete Department(s)',
        'Delete Role(s)',
        'Delete Employee(s)',
        'View Total Utilized Budget Of A Department'
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