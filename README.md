# ⚡ Image Factory Engine

An automated, high-precision image processing engine designed to bridge the gap between **Figma exports** and **Web-ready assets**. 

This tool takes high-resolution `3x` PNG exports and automatically converts them into optimized `2x` WebP files, while maintaining a timestamped "History" archive of every single export.



## 🚀 Features

* **Smart Downsampling:** Automatically converts 3x Figma frames to 2x WebP (approx. 66% width) to balance quality and performance.
* **Zero-Collision History:** Saves every original export in a `/history` folder with millisecond-precision timestamps: `Image - (Dec), (18), (2025) - [10-30-45-999-PM].png`.
* **Web Dashboard:** A clean, drag-and-drop interface for designers.
* **API-First Design:** Easily integrable with other workflows or future Docker/Electron wrappers.
* **Self-Cleaning:** Automatically manages the workspace to prevent clutter.

## 🛠️ Tech Stack

* **Engine:** [Node.js](https://nodejs.org/)
* **Processing:** [Sharp](https://sharp.pixelplumbing.com/) (High-performance image processing)
* **Server:** [Express.js](https://expressjs.com/) & [Multer](https://github.com/expressjs/multer)
* **Watcher:** [Chokidar](https://github.com/paulmillgoy/chokidar)

## 📦 Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/image-factory-engine.git](https://github.com/YOUR_USERNAME/image-factory-engine.git)
    cd image-factory-engine
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Start the Engine:**
    ```bash
    npm start
    ```

## 🖥️ Usage

1.  Keep the terminal running.
2.  Open `index.html` in your browser (using Live Server or by opening the file).
3.  Drag and drop your Figma PNG exports into the UI.
4.  Download your optimized WebP instantly!

> **Pro-Tip:** Your original files are safely backed up in the `./history` folder automatically.

## 📁 Folder Structure

* `/input`: Temporary storage for uploaded files.
* `/output`: Where your optimized WebP files live.
* `/history`: Your permanent archive of original assets.
* `index.html`: The designer-friendly dashboard.
* `server.js`: The "brain" of the operation.



## 🗺️ Roadmap

- [ ] Docker Compose support for one-click deployment.
- [ ] Electron wrapper for a standalone `.exe` / `.app` desktop experience.
- [ ] Quality slider (1-100) in the UI.
- [ ] Batch "Download All" as .zip.

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.