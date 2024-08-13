const Department = require('../models/department');
const Employee = require('../models/employee');
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

async function addEmployee(pool) {
    var managers = await pool.query(`SELECT CONCAT(e.first_name,' ', e.last_name) AS manager FROM employee e JOIN employee m ON e.id=m.manager_id  `)
    var role = await pool.query(`SELECT title FROM role`);

    managers = managers.rows.map((x) => x.manager);
    role = role.rows.map((x) => x.title);

    managers.push(new inquirer.Separator());
    managers.push('No manager');
    managers.push(new inquirer.Separator());

    role.push(new inquirer.Separator());

    await inquirer
        .prompt([
            {
                type: 'input',
                message: 'Employee first name: ',
                name: 'first_name',
                validate: input => input ? true : 'First name is required',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Employee last name: ',
                validate: input => input ? true : 'Last name is required'
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select employees role',
                choices: role,
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select employees manager',
                choices: managers,
            },
        ]).then(async (answer) => {
            const res = await pool.query(`SELECT id FROM role WHERE LOWER(role.title)=LOWER('${answer.role_id}')`);
            const role = res.rows;

            if(answer.manager_id === 'No manager'){
                try{
                    await pool.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ('${answer.first_name}', '${answer.last_name}', '${role[0].id}')`);  
                } catch(err){
                    console.log(err);
                    return;
                }
                console.log('\nSuccessfully added employee!\n');
                return;
            }

            const mRes = await pool.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = '${answer.manager_id}'`);
            const manager = mRes.rows;

            try{
                await pool.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answer.first_name}', '${answer.last_name}', '${role[0].id}', '${manager[0].id}')`);  
            } catch(err){
                console.log(err);
                return;
            }
            console.log('\nSuccessfully added employee!\n');
        })
}

async function addRole(pool){
    const res = await pool.query('SELECT name FROM department');
    const departments = res.rows;
    departments.push(new inquirer.Separator());

    await inquirer
        .prompt([
            {
                type: 'input',
                name: 'role_title',
                message: 'What is the new roles title: ',
                validate: input => input ? true : 'Role title is required',
            },
            {
                type: 'number',
                name: 'salary',
                message: 'What is the new roles salary: ',
                validate: input => !isNaN(input) ? true : 'salary must be a number'
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department does the new role belong to: ',
                choices: departments,
            }
        ]).then(async (answer) => {
            const res = await pool.query(`SELECT id FROM department WHERE name = '${answer.department}'`);
            const department = res.rows;

            try{
                await pool.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.role_title}', '${answer.salary}', '${department[0].id}')`);  
            } catch(err){
                console.log(err);
                return;
            }
            console.log('\nSuccessfully added role!\n')
        })
}

async function addDepartment(pool){
    await inquirer
        .prompt({
            type: 'input',
            name: 'departmentName',
            message: 'What is this departments name: ',
        }).then(async(answer)=>{
            try{
                await pool.query(`INSERT INTO department (name) VALUES ('${answer.departmentName}')`)
            } catch(err){
                console.log(err);
                return
            }
            console.log('Department successfully added!');
        })
}

async function updateEmployeeRole(pool){
    const res = await pool.query(`SELECT CONCAT(first_name, ' ', last_name) FROM employee`);
    const employees = res.rows.map((x) => x.concat);
    const rRes = await pool.query(`SELECT title FROM role`);
    const roles = rRes.rows.map((x) => x.title);

    roles.push(new inquirer.Separator());
    employees.push(new inquirer.Separator());

    await inquirer  
        .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Please select the employee to change roles: ',
                choices: employees
            },
            {
                type: 'list',
                name: 'newRole',
                message: `Please select the employees new role: `,
                choices: roles,
            }
        ]).then(async(answer) => {
            const res = await pool.query(`SELECT id FROM employee WHERE LOWER(CONCAT(first_name, ' ', last_name))=LOWER('${answer.employee}')`)
            const employeeId = res.rows[0].id;
            const rRes = await pool.query(`SELECT id FROM role WHERE LOWER(title)=LOWER('${answer.newRole}')`)
            const roleId = rRes.rows[0].id;

            try{
                await pool.query(`UPDATE employee SET role_id = '${roleId}' WHERE id = '${employeeId}';`)
            }catch(err){
                console.log(err);
                return;
            }

            console.log(`Succefully updated ${answer.employee}'s role`);
        })
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
myMap.set('Add Employees', addEmployee)
myMap.set('Add Role', addRole)
myMap.set('Add Department', addDepartment)
myMap.set('Update Employee Role', updateEmployeeRole)
myMap.set('Update Employee Manager', )
myMap.set('Delete Department(s)', )
myMap.set('Delete Role(s)', )
myMap.set('Delete Employee(s)', )

module.exports = myMap;



