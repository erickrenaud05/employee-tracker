const express = require('express');
const { Pool } = require('pg');
const inquirer = require('inquirer');
const startPrompt = require('./helpers/prompt');
require('dotenv').config();

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

async function connectToDatabase() {
    try {
        await pool.connect();
        
        startPrompt();
        
    } catch (err) {
        console.log(err);
        return 1
    }
    return 0;
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

connectToDatabase();