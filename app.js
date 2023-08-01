const express = require('express');
const bodyParser = require('body-parser');
const dbConfig = require('./dbConfig');
const dbOperations = require('./dbOperations');
const oracledb = require('oracledb');
const app = express();
const port = 3000;



// Initialize Oracle Database connection
(async () => {
  try {
    await dbConfig.initialize();
    // Check and create 'users' table if it doesn't exist
    await dbOperations.checkAndCreateUsersTable(dbConfig.dbConfig);
  } catch (err) {
    console.error('Error initializing the database: ', err);
    process.exit(1); // Terminate the application on database initialization failure
  }
})();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).send('Username and password are required.');
  }

  try {
    const userExists = await dbOperations.findUser(username, password);

    if (userExists) {
      // User is authenticated
      res.redirect('/welcome?username=' + encodeURIComponent(username));
    } else {
      // Invalid credentials
      res.send('Invalid username or password.');
    }
  } catch (err) {
    console.error('Error executing the query: ', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/welcome', (req, res) => {
  const username = req.query.username;
  if (username) {
    res.render('welcome', { username: decodeURIComponent(username) });
  } else {
    res.redirect('/');
  }
});

app.get('/register', (req, res) => {
  res.render('register');
});

// app.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   if (!username || !password) {
//     return res.status(400).send('Username and password are required.');
//   }

//   try {
//     const registrationResult = await dbOperations.insertUser(username, password);
//     res.send(registrationResult);
//   } catch (err) {
//     console.error('Error executing the query: ', err);
//     res.status(500).send('Internal Server Error');
//   }
// });
app.post('/register', async (req, res) => {
    try {
      const result = await dbOperations.insertUser(req.body.username, req.body.password);
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).send('Error registering user'); 
    }
  })

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
