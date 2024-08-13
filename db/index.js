const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
    {
        //Create .env file with the following information  DB_USER, DB_PASSWORD, DB_NAME (DB_NAME) should be employees_db
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: 'localhost',
        database: process.env.DB_NAME,
        port: 5432,
    }
)

module.exports = pool;