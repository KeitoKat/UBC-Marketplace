const express = require('express');
const router = express.Router();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../utils/config/cloudinary');

const MAX_IMAGES = 10;

/**
 * Reference: Chatgpt-4o
 * Prompt: How to use Cloudinary with Node.js and Express?
 */
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'dhgvpn9um',
    format: async (req, file) => 'jpeg',
    public_id: (req, file) => file.originalname,
  },
});

const upload = multer({ storage: storage });

router.post('/', upload.array('images', MAX_IMAGES), async (req, res) => {
  // Note the endpoint is now '/' instead of '/upload'
  try {
    const fileUrls = req.files.map((file) => file.path);
    res.json({ urls: fileUrls });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

module.exports = router;
