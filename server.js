const express = require('express');
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
    {
      user: 'postgres',
      password: 'password',
      host: 'localhost',
      database: 'employees_db'
    },
    console.log(`listening on port ${PORT}.`)
)
  
pool.connect();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });