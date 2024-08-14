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

async function viewEmployee(pool, extra='ORDER BY id'){
    const res = await pool.query(viewEmployeeQuery + extra);

    if(res.rows.length === 0){
        console.log('\nNo employees!\n');
        return;
    }

    console.log(formTable(res.rows));
}

async function viewRole(pool){
    const res = await pool.query('SELECT r.id, r.title, r.salary, d.name AS department FROM role r LEFT JOIN department d ON r.department_id=d.id');
    
    if(res.rows.length === 0){
        console.log('\nNo roles! \n');
        return;
    }
    
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
    
    if(res.rows.length === 0){
        console.log('\n No departments! \n');
        return;
    }

    await inquirer
        .prompt({
            type: 'list',
            message: 'Select which departments employees to view',
            name: 'selection',
            choices: res.rows,
        }).then(async (answer)=>{
            await viewEmployee(pool, `WHERE LOWER(d.name) = LOWER('${answer.selection}')`)
        })
}

async function viewEmployeeByManager(pool){
    const res = await pool.query(`SELECT CONCAT(e.first_name,' ', e.last_name) AS manager FROM employee e JOIN employee m ON e.id=m.manager_id GROUP BY e.id`);
    const promptChoices = res.rows.map((x) => x.manager);

    if(promptChoices.length === 0){
        console.log('\nNo managers! \n');
        return;
    }

    await inquirer
        .prompt({
            type: 'list',
            message: 'Select which managers employees to view',
            name: 'selection',
            choices: promptChoices,
        }).then(async (answer)=>{
            await viewEmployee(pool, `WHERE LOWER(CONCAT(m.first_name, ' ', m.last_name)) = LOWER('${answer.selection}')`)
        })
}

async function viewAllDepartments(pool){
    const res = await pool.query('SELECT * FROM department');

    if(res.rows.length === 0){
        console.log('\nNo departments!\n');
        return;
    }

    console.log(formTable(res.rows));
}

async function addEmployee(pool) {
    var managers = await pool.query(`SELECT CONCAT(first_name,' ', last_name) AS manager FROM employee`)
    var role = await pool.query(`SELECT title FROM role`);

    managers = managers.rows.map((x) => x.manager);
    role = role.rows.map((x) => x.title);

    managers.unshift(new inquirer.Separator());
    managers.unshift('No manager');
    managers.unshift(new inquirer.Separator());

    role.unshift(new inquirer.Separator());
    role.unshift('New Role');
    role.unshift(new inquirer.Separator());

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
                name: 'manager_id',
                message: 'Select employees manager',
                choices: managers,
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select employees role',
                choices: role,
            },
        ]).then(async (answer) => {
            if(answer.role_id === 'New Role'){
                answer.role_id = await addRole(pool);
            }
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
    departments.unshift(new inquirer.Separator());
    departments.unshift('New department');
    departments.unshift(new inquirer.Separator());
    var returnVal = '';

    await inquirer
        .prompt([
            {
                type: 'input',
                name: 'role_title',
                message: 'What is the new roles title: ',
                validate: input => input ? true : 'Role title is required',
            },
            {
                type: 'input',
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
            if(answer.department === 'New department'){
                answer.department = await addDepartment(pool);
            }
            
            const res = await pool.query(`SELECT id FROM department WHERE name = '${answer.department}'`);
            const department = res.rows;

            try{
                await pool.query(`INSERT INTO role (title, salary, department_id) VALUES ('${answer.role_title}', '${answer.salary}', '${department[0].id}')`);  
            } catch(err){
                console.log(err);
                return;
            }
            console.log('\nSuccessfully added role!\n');
            returnVal = answer.role_title;
        })
        return returnVal;
}

async function addDepartment(pool){
    var returnVal = '';
    await inquirer
        .prompt({
            type: 'input',
            name: 'departmentName',
            message: 'What is this departments name: ',
        }).then(async(answer)=>{
            try{
                await pool.query(`INSERT INTO department (name) VALUES ('${answer.departmentName}')`)
                returnVal = answer.departmentName;
            } catch(err){
                console.log(err);
                return
            }
            console.log('\nDepartment successfully added!\n')
        })
        return returnVal;
}

async function updateEmployeeRole(pool){
    await updateMe(pool, 'role', `SELECT id, title AS name FROM role`);
}

async function updateEmployeeManager(pool){
    await updateMe(pool, 'manager');
}

async function deleteEmployees(pool){
    const query = `SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`;

    await deleteThese(pool, 'employee', query);
}

async function deleteDepartments(pool){
    const query = 'SELECT id, name FROM department';

    await deleteThese(pool, 'department', query);
}

async function deleteRoles(pool){
    const query = 'SELECT id, title AS name FROM role';
    await deleteThese(pool, 'role', query);
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
myMap.set('Update Employee Manager', updateEmployeeManager)
myMap.set('Delete Department(s)', deleteDepartments)
myMap.set('Delete Role(s)', deleteRoles)
myMap.set('Delete Employee(s)', deleteEmployees)

//These functions are for the delete and update functions. After writing all of
//The functions, I noticed alot of repitition on those functions
//So I made these, that way the code is shorter and easier to fix

async function deleteThese(pool, deleteMe, query){
    //Query have to be retrieve id and name. If table doesn't have name, select needed value with (AS name)
    const res = await pool.query(query);
    const choices = res.rows.map((x) => x.name);
    const map = new Map(res.rows.map(obj => [obj.name, obj.id]));

    await inquirer
    .prompt([
        {
            type: 'checkbox',
            name: 'selection',
            message: `Select ${deleteMe}('s) you would like to delete: `,
            choices: choices,
        },
        {
            type: 'confirm',
            name: 'doubleCheck',
            message: `Are you sure you wish to delete the selected ${deleteMe}('s), this is irreversible!`,
        }
    ]).then(async(answer) => {
        if(!answer.doubleCheck){
            console.log(`\nOK! No ${deleteMe}s have been deleted!\n`);
            return;
        }
        for(let i = 0; i < answer.selection.length; i++){
            try{
                await pool.query(`DELETE FROM ${deleteMe} WHERE id = '${map.get(answer.selection[i])}';`)
            } catch(err){
                console.log(err);
                return;
            }
        }
    
        console.log(`\nSuccessfully deleted the following ${deleteMe}('s): ${answer.selection}\n`);
    })
}

async function updateMe(pool, column, columnQuery){
    //Query have to be retrieve id and name. If table doesn't have name, select needed value with (AS name)
    const res = await pool.query(`SELECT id, CONCAT(first_name, ' ', last_name) AS name FROM employee`);
    const choices = res.rows.map((x) => x.name);
    choices.push(new inquirer.Separator());
    const employeeMap = new Map(res.rows.map(obj => [obj.name, obj.id]));
    var columnChoices;
    var columnMap;
    const columnId = column + '_id';

    if(!columnQuery){
        columnMap = employeeMap;
        columnChoices = choices;
    } else{
        const res = await pool.query(columnQuery);
        columnChoices = res.rows.map((x) => x.name);
        columnMap = new Map(res.rows.map(obj => [obj.name, obj.id]));
        columnChoices.push(new inquirer.Separator());
    }

    await inquirer  
        .prompt([
            {
                type: 'list',
                name: 'selection',
                message: `Please select the employee to change ${column}s: `,
                choices: choices
            },
            {
                type: 'list',
                name: 'updatedSelection',
                message: `Please select the employees new ${column}: `,
                choices: columnChoices,
            }
        ]).then(async(answer) => {
            try{
                await pool.query(`UPDATE employee SET ${columnId} = '${columnMap.get(answer.updatedSelection)}' WHERE id = '${employeeMap.get(answer.selection)}';`)
            }catch(err){
                console.log(err);
                return;
            }

            console.log(`\nSuccessfully updated ${answer.selection}'s ${column}\n`);
        })
}

module.exports = myMap;