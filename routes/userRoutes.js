/*

Meant to handle user registration, login, and profile management (get, update, delete).

*/

const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcryptjs');
// const { body, validationResult } = require('express-validator');
const passport = require('../config/passport');  // What is imported is the fully configured passport object, 
                                                 // which includes "passport.authenticate(strategy, options)"
                                                
const { isAuthenticated } = require('../middleware/auth');

// // Registration validation middleware
// const registerValidation = [
//   body('email').isEmail().normalizeEmail(),
//   body('password').isLength({ min: 6 }),
//   body('name').trim().isLength({ min: 3 })
// ];

router.get('/all', async (req, res, next) => {
  try {
    const users = await db.getAllUsers();
    res.json(users);

  } catch (error) {
    next(error);
  }
});

// Registration route
router.post('/register', async (req, res, next) => {
  try {

    // This is how the payload should look like:
    // {
    //   "name": "test user",
    //   "username": "testuser",
    //   "email": "test@test.com",
    //   "password": "test123"
    // }
    const { name, username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await db.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });  // 400: Bad Request
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);  // 10 is the number of salt rounds

    // Create user
    const user = await db.createUser({
      name,
      username,
      email,
      password: hashedPassword
    });

    // Remove password from response
    delete user.password;

    res.status(201).json(user);

  } catch (error) {
    next(error);
  }
});

// Login route

router.post('/login', passport.authenticate('local'), async (req, res) => {     // If the user is not found in the database, 
                                                                                // the second callback ((req, res) => { ... }) is never executed.
                                                                                // Instead, Passport sends a 401 Unauthorized response.
    
    // if the user doesn't have a cart, create one
    const cartId = await db.getCartIdByUserId(req.user.id);
    if (!cartId) {
      const newCart = await db.createCart({ user_id: req.user.id });
      await db.assignCartIdToUserByUserId(req.user.id, newCart.id);
    }
    res.json({ message: 'Logged in successfully' });
});


// Get user profile
router.get('/profile', isAuthenticated, async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
});

// Update user profile
router.put('/profile', isAuthenticated, async (req, res, next) => {
  try {
   
  } catch (error) {
    next(error);
  }
});

// Delete user
router.delete('/:id', async (req, res, next) => {
  try {
    await db.deleteUser(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}); 

module.exports = router;