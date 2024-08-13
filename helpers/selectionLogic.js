const Department = require('../models/department');
const formTable = require('./table');
const inquirer = require('inquirer');

const viewEmployeeQuery = 
`
SELECT
    e.id AS id,
    e.first_name AS first_name,
	e.last_name AS last_name,
    r.title AS role,
    d.name AS department,
    r.salary AS salary,
    CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM
    employee e
LEFT JOIN
    employee m ON e.manager_id = m.id
LEFT JOIN
    role r ON e.role_id = r.id
LEFT JOIN 
    department d ON r.department_id=d.id
`
const myMap = new Map();

async function viewEmployee(pool){
    const res = await pool.query(viewEmployeeQuery);
    console.log(formTable(res.rows));
}

async function viewRole(pool){
    const res = await pool.query('SELECT r.id, r.title, r.salary, d.name AS department FROM role r LEFT JOIN department d ON r.department_id=d.id');
    console.log(formTable(res.rows));
}

async function viewBudget(pool){
    const res = await pool.query(`SELECT name FROM department`)
    let promptChoices = ['All departments'];
    promptChoices.push(res.rows);
    promptChoices = promptChoices.flat();

    await inquirer
        .prompt({
            type: 'list',
            message: 'Select which departments total utilized budget to view',
            name: 'selection',
            choices: promptChoices,
        }).then(async (answer)=>{
            if(answer.selection === 'All departments'){
                const newRes = await pool.query(`SELECT d.name AS department_name, SUM(r.salary) AS total_salary_spent FROM department d JOIN role r ON d.id = r.department_id JOIN employee e ON r.id = e.role_id GROUP BY d.name;`)
                console.log(formTable(newRes.rows));
                return;
            }
            const newRes = await pool.query(`SELECT d.name AS department, SUM(r.salary) AS total_utilized_budget FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id WHERE LOWER(d.name) = LOWER('${answer.selection}') GROUP BY d.name;`)
            console.log(formTable(newRes.rows));
        })
}

async function viewEmployeeByDepartment(pool){
    const res = await pool.query(`SELECT name FROM department`);
    
    await inquirer
        .prompt({
            type: 'list',
            message: 'Select which departments employees to view',
            name: 'selection',
            choices: res.rows,
        }).then(async (answer)=>{
            const newRes = await pool.query(`SELECT e.id AS employee_id, e.first_name, e.last_name, r.title AS title, r.salary AS salary, d.name AS department FROM employee e JOIN role r ON e.role_id = r.id JOIN  department d ON r.department_id = d.id WHERE LOWER(d.name) = LOWER('${answer.selection}')`)
            console.log(formTable(newRes.rows));
        })
}

async function viewEmployeeByManager(pool){
    const res = await pool.query(`SELECT CONCAT(e.first_name,' ', e.last_name) AS manager FROM employee e JOIN employee m ON e.id=m.manager_id`);
    const promptChoices = res.rows.map((x) => x.manager);

    await inquirer
        .prompt({
            type: 'list',
            message: 'Select which managers employees to view',
            name: 'selection',
            choices: promptChoices,
        }).then(async (answer)=>{
            const newRes = await pool.query(`SELECT e.first_name AS first_name, e.last_name AS last_name, r.title AS role, r.salary AS salary, d.name AS department FROM employee AS e JOIN employee AS manager ON e.manager_id = manager.id JOIN role r ON e.role_id = r.id JOIN department d ON r.department_id = d.id WHERE CONCAT(manager.first_name, ' ', manager.last_name) = '${answer.selection}'   `)
            console.log(formTable(newRes.rows));
        })
}

async function viewAllDepartments(pool){
    const res = await pool.query('SELECT * FROM department');
    console.log(formTable(res.rows));
}

function exitEmployeeManager(){
    process.exit();
}

myMap.set('View All Employees', viewEmployee);
myMap.set('Exit Employee Manager', exitEmployeeManager);
myMap.set('View All Roles', viewRole);
myMap.set('View Total Utilized Budget Of A Department', viewBudget);
myMap.set('View Employee By Department', viewEmployeeByDepartment)
myMap.set('View Employee By Manager', viewEmployeeByManager)
myMap.set('View All Department', viewAllDepartments)
myMap.set('Add Employees', )
myMap.set('Add Role', )
myMap.set('Add Department', )
myMap.set('Update Employee Role', )
myMap.set('Update Employee Manager', )
myMap.set('Delete Department(s)', )
myMap.set('Delete Role(s)', )
myMap.set('Delete Employee(s)', )

module.exports = myMap;



