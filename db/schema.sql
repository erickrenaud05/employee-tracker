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