DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

\c employees_db;

CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL
);

CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER
);

-- SQL QUERIES FOR FUNCTIONS
-- Query for total utilized budget
SELECT 
    d.name AS department_name,
    SUM(r.salary) AS total_salary_spent
FROM 
    department d
JOIN 
    role r ON d.id = r.department_id
JOIN 
    employee e ON r.id = e.role_id
GROUP BY 
    d.name;

-- Query for single departments total utilized budget
SELECT 
    SUM(r.salary) AS total_utilized_budget
FROM 
    employee e
JOIN 
    role r ON e.role_id = r.id
JOIN 
    department d ON r.department_id = d.id
WHERE 
    LOWER(d.name) = LOWER('${answer.selection}');

-- Query for view employee function
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

-- Query for view role
SELECT 
    r.id, 
    r.title, 
    r.salary, 
    d.name AS department 
FROM 
    role r 
LEFT JOIN 
    department d ON r.department_id=d.id

-- Query to view employee per department
SELECT 
    e.id AS employee_id,
    e.first_name,
    e.last_name,
    r.title AS title,
    r.salary AS salary,
    d.name AS department
FROM 
    employee e
JOIN 
    role r ON e.role_id = r.id
JOIN 
    department d ON r.department_id = d.id
WHERE
	LOWER(d.name) = LOWER('$(${answer.selection})')

-- Query for getting all managers
SELECT 
    CONCAT(e.first_name,' ', e.last_name) AS manager 
    FROM employee e 
    JOIN employee m ON e.id=m.manager_id  

-- Query for getting all employees by managers
SELECT 
    e.first_name AS first_name,
    e.last_name AS last_name,
    r.title AS role,
    r.salary AS salary,
    d.name AS department
FROM 
    employee AS e
JOIN 
    employee AS manager ON e.manager_id = manager.id
JOIN 
    role r ON e.role_id = r.id
JOIN
    department d ON r.department_id = d.id
WHERE 
	CONCAT(manager.first_name, ' ', manager.last_name) = '${anwser.selection}'   