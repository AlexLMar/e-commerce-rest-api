const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/all', async (req, res, next) => {
    try {
        const products = await db.getAllProducts();
        res.json(products);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
