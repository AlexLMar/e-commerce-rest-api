// Import necessary modules
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
const db = require("../db");

/*

What Passport does:

- It extracts the fields defined in the LocalStrategy configuration (email and password).
- These fields are extracted from req.body when using a form submission or a JSON body parser middleware 
  (like express.urlencoded() or express.json()). If these middlewares are not present, req.body will 
  be undefined, and Passport won't find email or password.
- If found, it will then pass it to the strategy's verify callback function.

*/

/*

- A session ID is sent back to the client as a cookie.
- The browser includes the session cookie (connect.sid) with every request to the server.
- For every new request, Passport checks the session using the session ID from the cookie.

*/

// Configure the local strategy for use by Passport
passport.use(
  new LocalStrategy(
    // The usernameField option is used to specify that the username field is 'email'
    // and not 'username' as it is expected by default in the request body
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        // Retrieve user from the database by email
        const user = await db.getUserByEmail(email); // This object contains user.id among other fields

        // If user is not found, return an error message
        if (!user) {
          // "done" is called with specific arguments to communicate the authentication result.
          // The signature looks like this:
          // done(error, user, info);

          return done(null, false, { message: "Incorrect email" });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        // If passwords do not match, return an error message
        if (!isMatch) {
          return done(null, false, { message: "Incorrect password" });
        }

        // If everything is correct, return the user object
        return done(null, user);
      } catch (error) {
        // Handle any errors that occur during the process
        return done(error);
      }
    }
  )
);

// Serialize the user ID to save in the session
passport.serializeUser((user, done) => {
  done(null, user.id); // The user ID is saved in the session at req.session.passport.user
});

// Deserialize the user by ID to retrieve the user object from the database
passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.getUserById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

/*
The code exports the fully configured passport object. This includes:

- The LocalStrategy for authenticating users by email and password.
- Serialization and deserialization functions for managing user sessions.
- Passport’s default methods for handling authentication, including "passport.authenticate()".

*/

module.exports = passport;
