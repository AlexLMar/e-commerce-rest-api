const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/all', async (req, res, next) => {
    try {
        const categories = await db.getAllCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
});

module.exports = router;