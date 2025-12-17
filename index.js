const sharp = require('sharp');
const chokidar = require('chokidar');
const path = require('path');
const fs = require('fs');
const notifier = require('node-notifier');

const inputDir = './input';
const outputDir = './output';
const historyDir = './history';

// Ensure folders exist
[inputDir, outputDir, historyDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

/**
 * Generates a unique "Fingerprint" for every export
 * Format: Name - (Dec), (18), (2025) - [10-30-45-999-PM]
 */
const getUniqueKey = (nameOnly) => {
  const now = new Date();
  const month = now.toLocaleString('en-US', { month: 'short' });
  const day = now.getDate();
  const year = now.getFullYear();

  const hours = now.getHours();
  const mins = now.getMinutes().toString().padStart(2, '0');
  const secs = now.getSeconds().toString().padStart(2, '0');
  const ms = now.getMilliseconds().toString().padStart(3, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;

  const timeStamp = `${hour12}-${mins}-${secs}-${ms}-${ampm}`;
  const dateStamp = `(${month}), (${day}), (${year})`;

  return `${nameOnly} - ${dateStamp} - [${timeStamp}]`;
};

console.log('🚀 High-Precision Engine Active.');
console.log('Watching /input... Every export will get a unique ID.');

chokidar.watch(inputDir, {
  ignoreInitial: true,
  awaitWriteFinish: {
    stabilityThreshold: 500,
    pollInterval: 100
  }
}).on('add', async (filepath) => {
  const filename = path.basename(filepath);
  const ext = path.extname(filename).toLowerCase();
  const nameOnly = path.parse(filename).name;

  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return;

  // Generate the MASTER KEY for this specific export
  const fileKey = getUniqueKey(nameOnly);

  try {
    // Pathing using the Key
    const historyPath = path.join(historyDir, `${fileKey}${ext}`);
    const outputPath = path.join(outputDir, `${fileKey}.webp`);

    // 1. Move a copy to History immediately
    fs.copyFileSync(filepath, historyPath);

    // 2. Process to WebP using the same Key
    const image = sharp(filepath);
    const metadata = await image.metadata();

    await image
      .resize({ width: Math.round(metadata.width * 0.66) })
      .webp({ quality: 80, effort: 6, smartSubsample: true })
      .toFile(outputPath);

    console.log(`\n✨ NEW EXPORT DETECTED`);
    console.log(`   ID: ${fileKey}`);
    console.log(`   Status: WebP Created & History Logged`);

    // 3. Clean up the input folder
    setTimeout(() => {
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    }, 200);

  } catch (err) {
    console.error(`🚨 Factory Error for ${filename}:`, err.message);
    notifier.notify({
      title: 'Conversion Failed',
      message: `Check the console for ${filename}`,
      sound: true
    });
  }
});