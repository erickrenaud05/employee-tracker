const formTable = require('./table');
const startPrompt = require('./prompt');
const inquirer = require('inquirer');

const myMap = new Map();

function viewEmployee(){
    console.log('hey');
}

function exitEmployeeManager(){
    process.exit();
}

myMap.set('View All Employees', viewEmployee);
myMap.set('Exit Employee Manager', exitEmployeeManager);

module.exports = myMap;



