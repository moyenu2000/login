// dbOperations.js
const dbConfig = require('./dbConfig');
const oracledb = require('oracledb');

async function getConnection() {
    return await dbConfig.pool.getConnection();
  }


async function checkAndCreateUsersTable(dbConfig) {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const schemaName = dbConfig.user.toUpperCase();

    // Check if the 'users' table exists in the database
    const tableExistsSQL = `
      SELECT count(*) as tableCount
      FROM all_tables
      WHERE table_name = 'USERS' AND owner = :schemaName
    `;
    const result = await connection.execute(tableExistsSQL, [schemaName]);
    const tableCount = result.rows[0].TABLECOUNT;

    if (tableCount === 0) {
      // 'users' table doesn't exist, create it
      const createTableSQL = `
        CREATE TABLE users (
          id NUMBER GENERATED ALWAYS AS IDENTITY,
          username VARCHAR2(50) NOT NULL UNIQUE,
          password VARCHAR2(255) NOT NULL,
          PRIMARY KEY (id)
        )
      `;
      await connection.execute(createTableSQL);
      console.log('Created "users" table.');
    }

    await connection.close();
  } catch (err) {
    console.error('Error checking or creating the "users" table: ', err);
    throw err;
  }
}

async function insertUser(username, password) {

    //const hashedPassword = await bcrypt.hash(password, 10);
  
    const sql = `INSERT INTO users (username, password) 
                 VALUES (:username, :password)`;
  
    const binds = [username, password];
  
    const connection = await getConnection();
  
    try {
      await connection.execute(sql, binds, { autoCommit: true });
    } finally {
      await connection.close(); 
    }
  
  }
  

async function findUser(username, password) {
  try {
    const connection = await oracledb.getConnection();

    const sql = 'SELECT * FROM users WHERE username = :username AND password = :password';
    const result = await connection.execute(sql, [username, password]);

    await connection.close();
    return result.rows.length === 1;
  } catch (err) {
    console.error('Error executing the query: ', err);
    throw err;
  }
}

module.exports = {
  checkAndCreateUsersTable,
  insertUser,
  findUser
};


//const bcrypt = require('bcrypt');

// Rest of db operations using getConnection()


// Other functions