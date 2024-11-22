const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/all', async (req, res, next) => {
    try {
        const orders = await db.getAllOrders();
        res.json(orders);
    } catch (error) {
        next(error);
    }
});

module.exports = router;