const express = require('express');
const { Pool } = require('pg');
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
  
pool.connect();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

pool.query('SELECT * FROM department', (err, {rows})=>{
    console.log(rows);
})