const formTable = require('./table');

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

function exitEmployeeManager(){
    process.exit();
}

myMap.set('View All Employees', viewEmployee);
myMap.set('Exit Employee Manager', exitEmployeeManager);
myMap.set('View All Roles', viewRole);

module.exports = myMap;



