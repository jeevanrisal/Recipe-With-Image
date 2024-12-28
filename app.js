const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const detectLables = require('./detectLabels');
const generateRecipe = require('./generateRecipe');

const app = express();

app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const upload = multer({ storage: storage });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // Click 'View Credentials' below to copy your API secret
});

app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    const imagePath = req.file.path;
    // console.log(ingredients);

    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'uploads', // Optional: specify a folder in your Cloudinary account
    });

    const imageUrl = result.secure_url;

    console.log(imageUrl);

    const ingredients = await detectLables(imageUrl); // Ensure this returns an array

    if (!Array.isArray(ingredients)) {
      throw new Error('Expected an array of ingredients from detectLabels');
    }

    const recipe = await generateRecipe(ingredients);

    res.json({ recipe });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;
