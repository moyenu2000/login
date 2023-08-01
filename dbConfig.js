const oracledb = require('oracledb');

let pool;

const dbConfig = {
  user: process.env.DB_USER || 'hr',
  password: process.env.DB_PASSWORD || 'hr',
  connectString: process.env.DB_CONNECT_STRING || 'localhost/orcl'  
};

async function initialize() {
  try {
    pool = await oracledb.createPool(dbConfig);
    console.log('Connected to Oracle Database Pool');
  } catch(err) {
    console.error('Error creating pool: ', err);
    process.exit(1);
  }
}

module.exports = {
  initialize,
  pool,
  dbConfig
};