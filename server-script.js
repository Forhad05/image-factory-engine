const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const results = document.getElementById('results');

// Dynamically find the API based on where the user is looking
const API_BASE = `http://${window.location.hostname}:3000`;

dropZone.onclick = () => fileInput.click();

// Drag & Drop Listeners
['dragenter', 'dragover'].forEach(name => {
  dropZone.addEventListener(name, (e) => { e.preventDefault(); dropZone.classList.add('active'); });
});
['dragleave', 'drop'].forEach(name => {
  dropZone.addEventListener(name, (e) => { e.preventDefault(); dropZone.classList.remove('active'); });
});

dropZone.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  Array.from(files).forEach(uploadFile);
});

fileInput.onchange = (e) => Array.from(e.target.files).forEach(uploadFile);

async function uploadFile(file) {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch(`${API_BASE}/upload`, { method: 'POST', body: formData });
    const data = await response.json();
    if (data.success) renderCard(data);
  } catch (err) {
    console.error("Upload failed", err);
    alert("Cannot reach the engine. Is server.js running?");
  }
}

function renderCard(data) {
  const div = document.createElement('div');
  div.className = 'card';
  div.innerHTML = `
      <img src="${API_BASE}/output/${data.webpName}" alt="thumb">
      <div class="card-info">
          <strong>${data.originalName}</strong>
          <div style="font-size: 12px; color: #666; margin-top: 4px;">Key: ${data.fileKey}</div>
      </div>
      <a href="${API_BASE}/output/${data.webpName}" download="${data.webpName}" class="download-btn">Download</a>
  `;
  results.prepend(div);
}