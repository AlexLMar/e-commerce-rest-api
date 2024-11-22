/*

Meant to handle cart management (create, get, add item, update item, delete item, delete cart).

*/

const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
// const { body, validationResult } = require('express-validator');
const passport = require("../config/passport"); // What is imported is the fully configured passport object,
// which includes "passport.authenticate(strategy, options)"

const { isAuthenticated } = require("../middleware/auth");

/*  
POST	/cart	
GET	/cart
POST	/cart/items
PUT	/cart/items/:id
DELETE	/cart/items/:id
DELETE	/cart
*/

// Create a cart for the user, only if the user doesn't have a cart yet
router.post("/", isAuthenticated, async (req, res, next) => {
  try {
    const cartId = await db.getCartIdByUserId(req.user.id);
    if (!cartId) {
      const cart = await db.createCart({ user_id: req.user.id });
      res.status(201).json(cart);
    } else {
      res.status(400).json({ message: "Cart already exists" });
    }
  } catch (error) {
    next(error);
  }
});

router.get("/", isAuthenticated, async (req, res, next) => {
  try {
    const cart = await db.getCartByUserId(req.user.id);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// Add an item to the cart
/* 
    The request body should have the following structure:
    {
        product_id: <product_id>,
        quantity: <quantity>
    }
*/
router.post("/items", isAuthenticated, async (req, res, next) => {
  try {
    const cartItem = await db.createCartItem(req.user.cart_id, req.body);
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
});

// Update an item in the cart
/* 
    The request body should have the following structure:
    {
        quantity: <quantity>
    }
*/
router.put("/items/:product_id", isAuthenticated, async (req, res, next) => {
  try {
    const cartItem = await db.updateCartItem(
      req.params.product_id,
      req.user.cart_id,
      req.body
    );
    res.json(cartItem);
  } catch (error) {
    next(error);
  }
});

// Delete an item from the cart
/* 
    The request body should have the following structure:
    {
        quantity: <quantity>
    }
*/
router.delete("/items/:product_id", isAuthenticated, async (req, res, next) => {
  try {
    await db.deleteCartItem(req.params.product_id, req.user.cart_id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Delete the cart
router.delete("/", isAuthenticated, async (req, res, next) => {
  try {
    await db.deleteCart(req.user.cart_id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
