// Import required dependencies
const express = require('express');             // to use middleware
const routes = require('./routes');

/*

If require('./routes') points to a folder, Node.js will:

    1. Look for an index.js file in the folder and load it as the entry point.
    2. Check for a package.json in the folder and load the file specified in its "main" field.
    3. Throw an error if neither index.js nor a valid package.json exists.

Then: 

    4. The entire index.js is executed, in its own scope.
    5. The router object is created, routes are added to it, and it is exported.
    6. The router object is returned to app.js and assigned to routes.

Only the exported router object is accessible in app.js. Any internal variables or functions in index.js remain private.

Each file in Node.js is isolated and must explicitly declare its dependencies. The require('express') in app.js is not shared with router.js, so you need to explicitly require express in router.js as well. This design ensures modularity, avoids unintended variable sharing, and makes each file self-contained.

*/

const passport = require('passport');
const session = require('express-session');
// const isAdmin = require('./middleware/isAdmin');

// Import passport configuration
// This file contains our authentication strategies
require('./config/passport');

// Initialize Express application
const app = express();

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json());                         // Parse JSON payloads. This automatically parses JSON data in request bodies. 
                                                 // Adding properties to the request object, such as req.body.
                                                 
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded payloads. This automatically parses URL-encoded data in request bodies.
                                                 // Adding properties to the request object, such as req.body. (Not req.params. This is done by express 
                                                 // based on the route parameters defined in the route's path.)


/*

The express-session middleware (const session) handles:

- Reading the session ID from the cookie (sent by the client with the request) (for example: connect.sid=s%3AAfajkljdf123df...; Path=/; HttpOnly).
- Retrieving the session data (stored on the server) using the session ID.
- Attaching the session data to the req.session object. 

*/

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key', // Key used to sign the session ID cookie
  resave: false,     // Don't save session if unmodified
  saveUninitialized: false, // Don't create session until something stored
  cookie: { maxAge: 3600000 } // 1 hour in milliseconds
}));

// Initialize Passport authentication
app.use(passport.initialize()); // Initialize Passport
app.use(passport.session());    // Use persistent login sessions

// Register all application routes
app.use('/', routes);

// Global error handling middleware
// Catches all errors passed to next()
app.use((err, req, res, next) => {
  console.error(err.stack);  // Log error stack trace
  res.status(500).send('Something broke!'); // Send generic error response
});

// Export the configured Express app
module.exports = app; 