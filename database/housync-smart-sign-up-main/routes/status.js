const express = require('express');
const router = express.Router();
const edenaiService = require('../services/edenaiService');

router.get('/:executionId', async (req, res) => {
    try {
        const executionId = req.params.executionId;
        const result = await edenaiService.checkStatus(executionId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error checking status' });
    }
});

module.exports = router;