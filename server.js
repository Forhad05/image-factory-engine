const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// 1. Enable CORS so your UI (on port 5500) can talk to this server (on port 3000)
app.use(cors());
app.use('/output', express.static('output'));

// 2. Ensure all directories exist
const dirs = ['./input', './output', './history'];
dirs.forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });

// 3. Configure Multer for temporary storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, './input'),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

/**
 * Unique Key Generator with Milliseconds
 * Format: Name - (Dec), (18), (2025) - [10-30-45-999-PM]
 */
const getUniqueKey = (nameOnly) => {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' });
  const day = now.getDate();
  const year = now.getFullYear();
  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  }).replace(/:/g, '-').replace(' ', '-');
  const ms = now.getMilliseconds().toString().padStart(3, '0');

  return `${nameOnly} - (${month}), (${day}), (${year}) - [${timeStr}-${ms}]`;
};

// 4. The Main Upload Route
app.post('/upload', upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });

  const nameOnly = path.parse(req.file.originalname).name;
  const ext = path.extname(req.file.originalname).toLowerCase();
  const fileKey = getUniqueKey(nameOnly);

  const historyPath = path.join('./history', `${fileKey}${ext}`);
  const outputPath = path.join('./output', `${fileKey}.webp`);

  try {
    // Copy to history first
    fs.copyFileSync(req.file.path, historyPath);

    // Process with Sharp (3x to 2x conversion)
    const image = sharp(req.file.path);
    const metadata = await image.metadata();

    await image
      .resize({ width: Math.round(metadata.width * 0.66) })
      .webp({ quality: 80, effort: 6, smartSubsample: true })
      .toFile(outputPath);

    // Clean up input folder
    fs.unlinkSync(req.file.path);

    res.json({
      success: true,
      fileKey: fileKey,
      webpName: `${fileKey}.webp`,
      originalName: req.file.originalname
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => console.log(`🚀 Image Factory Engine running on port ${port}`));