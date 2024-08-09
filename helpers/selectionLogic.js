const formTable = require('./table')

const myMap = new Map();

const viewEmployeeQuery = 
`
SELECT
    e.id AS id,
    e.first_name AS first_name,
	e.last_name AS last_name,
    r.title AS role,
    r.salary AS salary,
    CONCAT(m.first_name, ' ', m.last_name) AS manager
FROM
    employee e
LEFT JOIN
    employee m ON e.manager_id = m.id
LEFT JOIN
    role r ON e.role_id = r.id;
`

async function viewEmployee(pool){
    const employees = [];
    try{
        await pool.query(viewEmployeeQuery, function (err, { rows }) {      
            formTable(rows, 'id', 'first_name', 'last_name', 'role', 'salary', 'manager')
        });
        
    } catch(err){
        console.log(err)
    }
}

function exitEmployeeManager(pool){
    process.exit();
}

myMap.set('View All Employees', viewEmployee);
myMap.set('Exit Employee Manager', exitEmployeeManager);

module.exports = myMap;



