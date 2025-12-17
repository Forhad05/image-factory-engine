const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      webSecurity: false,    // Required to read local file paths from the drop event
      nodeIntegration: true, // Required to use 'require' in index.html
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  // Optional: win.webContents.openDevTools(); // Uncomment to debug
}

// Boilerplate for standard Desktop App behavior
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

/**
 * High-precision key logic
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

/**
 * The Engine: Dynamic Conversion Logic
 */
ipcMain.handle('convert-image', async (event, filePath) => {
  try {
    if (!filePath) throw new Error("No file path provided.");

    const parsedPath = path.parse(filePath);
    const fileKey = getUniqueKey(parsedPath.name);

    // DYNAMIC PATH: Create 'Converted_WebP' folder in the same directory as the original file
    const outputFolder = path.join(parsedPath.dir, 'Converted_WebP');
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder, { recursive: true });
    }

    const outputPath = path.join(outputFolder, `${fileKey}.webp`);

    // Perform the 3x to 2x conversion
    const metadata = await sharp(filePath).metadata();
    await sharp(filePath)
      .resize({ width: Math.round(metadata.width * 0.66) })
      .webp({ quality: 80, effort: 6 })
      .toFile(outputPath);

    return {
      success: true,
      path: outputPath,
      name: `${fileKey}.webp`
    };
  } catch (err) {
    console.error("Conversion failed:", err);
    return { success: false, error: err.message };
  }
});