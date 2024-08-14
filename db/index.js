const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool(
    {
        //Go to .env file and populate. DB_NAME should be employees_db
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: 'localhost',
        database: process.env.DB_NAME,
        port: 5432, //If trouble shouting the connection make sure your pgAdmin is listening on the proper port
    }
)

module.exports = pool;