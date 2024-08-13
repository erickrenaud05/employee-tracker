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
    const res = await pool.query(`SELECT d.name AS department_name, SUM(r.salary) AS total_salary_spent FROM department d JOIN role r ON d.id = r.department_id JOIN employee e ON r.id = e.role_id GROUP BY d.name;`)
    console.log(formTable(res.rows));
}

function exitEmployeeManager(){
    process.exit();
}

myMap.set('View All Employees', viewEmployee);
myMap.set('Exit Employee Manager', exitEmployeeManager);
myMap.set('View All Roles', viewRole);
myMap.set('View Total Utilized Budget Of A Department', viewBudget);
myMap.set('View Employee By Department', )
myMap.set('View Employee By Manager', )
myMap.set('View All Department', )
myMap.set('Add Employees', )
myMap.set('Add Role', )
myMap.set('Add Department', )
myMap.set('Update Employee Role', )
myMap.set('Update Employee Manager', )
myMap.set('Delete Department(s)', )
myMap.set('Delete Role(s)', )
myMap.set('Delete Employee(s)', )

module.exports = myMap;



