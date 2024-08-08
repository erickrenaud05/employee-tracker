const myMap = new Map();
const viewEmployeeQuery = 
`
SELECT
    e.id AS employee_id,
    e.first_name AS employee_first_name,
	e.last_name AS  employee_last_name,
    r.title AS employee_role,
    CONCAT(m.first_name, ' ', m.last_name) AS manager_name
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
            employees.push(rows);
            console.log(employees)
        });
        
    } catch(err){
        console.log(err)
    }
   
    
}

myMap.set('View All Employees', viewEmployee);

module.exports = myMap;



