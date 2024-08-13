const pool = require('./db/index');
const inquirer = require('inquirer');
const myMap = require('./helpers/selectionLogic');

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

async function main() {
    await inquirer
    .prompt({
        type: 'list',
        message: 'What would you like to do?',
        name: 'selection',
        choices: myChoices,
    })
    .then((answer) => {
        const selection = myMap.get(answer.selection);
        selection();
    })
}


main();



// const viewEmployeeQuery = 
// `
// SELECT
//     e.id AS id,
//     e.first_name AS first_name,
// 	e.last_name AS last_name,
//     r.title AS role,
//     d.name AS department,
//     r.salary AS salary,
//     CONCAT(m.first_name, ' ', m.last_name) AS manager
// FROM
//     employee e
// LEFT JOIN
//     employee m ON e.manager_id = m.id
// LEFT JOIN
//     role r ON e.role_id = r.id
// LEFT JOIN 
//     department d ON r.department_id=d.id
// `

    
//     //drawLogo();//Logo by UofT coding bootcamp
//     // console.log('loading...');
//     let currentEmployees = null;
//     let currentRoles = null;
//     let currentDepartments = null;    
//     let db = [];

//     pool.query(viewEmployeeQuery, function (err, { rows }) {  
//         currentEmployees = rows;
//         db.push(currentEmployees);
//     })
//     pool.query('SELECT r.id, r.title, r.salary, d.name AS department FROM role r LEFT JOIN department d ON r.department_id=d.id', function(err, { rows }){
//         currentRoles = rows;
//         db.push(currentRoles);
//     })
//     pool.query('SELECT * FROM department',  function(err, { rows }){
//         currentDepartments = rows;
//         db.push(currentDepartments);
//     })

//     console.log(db)