// 1. Get Electron's IPC tools
const { ipcRenderer, webUtils, shell } = require('electron');

const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const results = document.getElementById('results');

dropZone.onclick = () => fileInput.click();

// 2. Drag & Drop Logic
['dragenter', 'dragover'].forEach(name => {
  dropZone.addEventListener(name, (e) => { e.preventDefault(); dropZone.classList.add('active'); });
});
['dragleave', 'drop'].forEach(name => {
  dropZone.addEventListener(name, (e) => { e.preventDefault(); dropZone.classList.remove('active'); });
});

dropZone.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  Array.from(files).forEach(processFile);
});

fileInput.onchange = (e) => Array.from(e.target.files).forEach(processFile);

// 3. The Core Processing Function
async function processFile(file) {
  // 1. THIS IS THE KEY: Use Electron's webUtils to get the path
  // In newer Electron, file.path is often blank for security
  const { webUtils } = require('electron');
  const filePath = webUtils.getPathForFile(file);

  console.log("Found path:", filePath);

  if (!filePath) {
    alert("Electron still cannot see the file path. Try selecting the file via the button instead of dragging.");
    return;
  }

  const card = createLoadingCard(file.name);
  results.prepend(card);

  try {
    const result = await ipcRenderer.invoke('convert-image', filePath);

    if (result.success) {
      updateCardToSuccess(card, result);
    } else {
      card.innerHTML = `<p style="color:red">❌ Error: ${result.error}</p>`;
    }
  } catch (err) {
    console.error(err);
    card.innerHTML = `<p style="color:red">❌ System Error: ${err.message}</p>`;
  }
}

function createLoadingCard(fileName) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `<strong>⚡ Processing ${fileName}...</strong>`;
  return div;
}

function updateCardToSuccess(card, data) {
  card.innerHTML = `
    <div class="card-info">
      <strong>✅ ${data.name}</strong>
      <br><small>Saved to: ${data.path}</small>
    </div>
    <button class="download-btn" onclick="openFile('${data.path.replace(/\\/g, '/')}')">Show in Folder</button>
  `;
}

function openFile(filePath) {
  // Use Electron's shell to open the folder and highlight the file
  const { shell } = require('electron');
  shell.showItemInFolder(filePath);
}