const express = require('express');
const router = express.Router();
const edenaiService = require('../services/edenaiService');

router.post('/', async (req, res) => {
    try {
        const fileBuffer = req.file.buffer;
        const filename = req.file.originalname;

        // Send file to Eden AI
        const executionId = await edenaiService.uploadFile(fileBuffer, filename);
        res.json({ executionId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

module.exports = router;