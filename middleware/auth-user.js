'use strict';

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
  let message;
  const credentials = auth(req);

  if (credentials) {  // if the authentication is successful
   const user = await User.findOne({ where: { emailAddress: credentials.name } });

   if (user) {
    const authenticated = bcryptjs.compareSync(credentials.pass, user.password);

    if (authenticated) {
      console.log(`Authentication successful for username: ${user.emailAddress}`);
      req.currentUser = user;
    } else {
      message = `Authentication failed for username: ${user.emailAddress}`;
    }
   } else {
      message = `User not found for username: ${credentials.name}`;
   }
  } else {  
    message = 'Auth header not found';
  }

  if (message) { // if authentication fails
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
}