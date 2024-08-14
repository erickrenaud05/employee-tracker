# Employee Tracker

## Table of content
[Description](#description)\
[Usage](#usage)\
[license](#license)\
[Installation](#installation)\
[InstallationSteps](#installation-steps)\
[Credits](#credits)\
[Questions](#questions)

## Description
This employee tracker is a command line interface application used to manage employees, roles and department they belong to using postgresSQL database. This app uses node.js with the following packages: inquirer, pg and dotenv.

## Usage
Once installed, make sure you are in the project directory and run index.js. Then you will be shown a list of prompts you can select from to preform different actions. These prompts are separated in 5 sections: View, Add, Update, Delete and exit. Simply scroll through and select what you would like to do. If you wish to add, simply select that prompt and then follow the new prompts you are given, if while adding, you realize the role or department does not yet exist, simply pick new role once asked about said role and you will be able to add role and department from any add function. When deleting, you will be shown a list of names of whatever you would like to delete, simply select all the options you would like to delete and then confirm the deletion. Once you are done, simply press Exit. Here is a video demonstration on how to use this cli application: [Demonstration](usageGuide/Module12ScreenRecording.mp4).

## Installation
To use this generator, you will first need to make sure you have node.js installed. To make sure you have node.js installed, run node -v in your terminal. If you receive a message indicating you do not have node, please visit https://nodejs.org/en/download/prebuilt-installer/current and download the current version. After this, you will need to make sure you have pgAdmin4 to run your postgres database. If this is not yet installed please refer to this installation guide https://coding-boot-camp.github.io/full-stack/postgresql/postgresql-installation-guide. Now that you have node.js and pgAdmin4, make your way to the project repository and look at the db folder, there you will see a file called schema.sql and seeds.sql. Go to pgAdmin and create a database called employees_db as the schema directs. Once the database is created use the pgAdmin query tool and copy paste the create table queries from the schema and run each once at a time. After your database has the required tables, you can either prepopulate the database using the queries in the seeds.sql file or simply start the application and populate it from the app itself. Note that if you chose not to prepopulate the tables, the view functions won't show you anything. Make sure you use npm install to install all dependents. And populate the two sections in the .env file with your servers user and password.

## installation Steps
STEP 1
Ensure you have node installed
``` powershell
    node -v
```
STEP 1.5 (if node is not installed)\
Refer to installation guide: https://nodejs.org/en/download/prebuilt-installer/current and download the current version.

STEP 2\
Make sure pgAdmin4 is downloaded on your device. if it isn't, refer to this installation guide: https://coding-boot-camp.github.io/full-stack/postgresql/postgresql-installation-guide.

STEP 3\
Make your way to your project repository either through your files or in a terminal using\

```powershell
    cd 'your/file/path'
```
STEP 4\
Open the db folder using

```powershell
    code db
```
And view the schema.sql file. There you will see the database name, and tables needed to run this cli. Make your way to your pgAdmin server, create a database called employees_db, open the query tool and run the queries from the schema

```sql
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
```
STEP 5 (skip this step if you do not wish to seed your database)/

Run each of these queries one at a time in the query tool in pgAdmin in your database

```sql
INSERT INTO department (name)
VALUES 
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales')

INSERT INTO role (title, salary, department_id)
VALUES
    ('Sales Lead', 100000, 4),
    ('Salesperson', 80000, 4),
    ('Lead Engineer', 150000, 1),
    ('Software Engineer', 120000, 1),
    ('Account Manager', 160000, 2),
    ('Accountant', 125000, 2),
    ('Legal Team Lead', 250000, 3),
    ('Lawyer', 190000, 3)

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1, null),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3, null),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5, null),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7, null),
    ('Tom', 'Allen', 8, 7)

```
STEP 6\
Make sure your dependencies are installed

```powershell
    npm install
```
STEP 7\
Populate the .env.example file with your database information and change the file name to .env using either files or the following command

```powershell
    mv .env.example .env
```

STEP 8\
Now you can use to cli app by using:

```powershell
    node index.js
```
## Credits
Credits to chatGPT for the table generating function

## License
Please refer to license in repo or badge area

## Badges
![MIT](https://img.shields.io/badge/license-MIT-blue)

## Questions
If you have any questions, email me at renaud_junior@outlook.com, or visit my github page at https://github.com/erickrenaud05

