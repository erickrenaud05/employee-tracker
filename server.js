const { Pool } = require('pg');
const inquirer = require('inquirer');
require('dotenv').config();

const pool = new Pool(
    {
        //Create .env file with the following information  DB_USER, DB_PASSWORD, DB_NAME (DB_NAME) should be employees_db
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: 'localhost',
        database: process.env.DB_NAME
    },
    console.log(`listening on port ${PORT}.`)
)

pool.connect()

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})


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