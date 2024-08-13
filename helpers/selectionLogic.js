const formTable = require('./table');
const startPrompt = require('./prompt');
const inquirer = require('inquirer');

const myMap = new Map();

function viewEmployee(currentEmployees){
    console.log(currentEmployees);
}

function exitEmployeeManager(pool){
    process.exit();
}

myMap.set('View All Employees', viewEmployee);
myMap.set('Exit Employee Manager', exitEmployeeManager);

module.exports = myMap;



