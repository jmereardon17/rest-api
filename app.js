'use strict';

// load modules
const express = require('express');
const sequelize = require('./models').sequelize;
const routes = require('./routes');

// create the Express app
const app = express();

// Setup request body JSON parsing
app.use(express.json());

// import routes
app.use('/api', routes);

// setup a friendly greeting for the root route
app.get('/', (req, res) => res.json({ message: 'Welcome to the REST API project!' }));

// send 404 if no other route matched
app.use((req, res) => res.status(404).json({ message: 'Route Not Found' }));

// setup a global error handler
app.use((err, req, res, next) => {
  console.log('err', err);
  if (err.name.includes('Sequelize')) {
    const errors = err.errors.map(error => error.message);
    res.status(400).json({ errors });
  } else {
    res.status(err.status || 500).json({ error: err.message });
  }
});

// set our port
app.set('port', process.env.PORT || 5000);

// start listening on our port
const server = app.listen(app.get('port'), () => console.log(`App is running on port ${server.address().port}`));

// Connect to the database
(() => {
  console.log('Connecting to the database...');
  try {
    sequelize.authenticate();
    console.log('Connection to the database was successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();