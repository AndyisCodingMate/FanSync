const express = require('express');
const multer = require('multer');
const path = require('path');
const edenaiService = require('../services/edenaiService');

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Save files in the "uploads" directory
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename with timestamp
    }
});
const upload = multer({ storage });

// Upload endpoint
router.post('/', upload.single('file'), async (req, res) => {
    try {
        const filePath = req.file.path; // Path of the saved file

        // Send file to Eden AI for processing
        const executionId = await edenaiService.uploadFile(filePath);

        res.json({ executionId, uploadedImage: filePath });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading file' });
    }
});

module.exports = router;