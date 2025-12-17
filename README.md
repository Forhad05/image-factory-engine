⚡ Image Factory (Mac & Linux Edition)

Welcome to the Dockerized version of the Image Factory! This version is built for cross-platform compatibility, allowing macOS and Linux users to run the conversion engine without needing to install Node.js or handle Windows-specific files.
🍎 Why use this version?

    Zero Dependency: No need to install Node.js, Sharp, or libraries on your local machine.

    Architecture Agnostic: Works perfectly on Intel Macs and Apple Silicon (M1/M2/M3).

    Folder Sync: Drag files into a local folder on your Mac, and let the Linux container do the work.

🚀 Quick Start (Mac Users)
1. Prerequisites

Ensure you have Docker Desktop installed and running.
2. Setup

Open your Terminal and run the following commands:
Bash

# Clone the specific docker branch
git clone -b docker-version https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Move into the project
cd YOUR_REPO_NAME

# Launch the factory
docker-compose up --build -d

3. Use the App

Once the build is finished, open your browser to: 👉 http://localhost:3000
📥 Two Ways to Convert
Option A: The Web Interface

Simply drag your 3x PNG files into the browser window. The optimized WebP files will be generated and can be "Shown in Folder" immediately.
Option B: The "Magic" Folders

This branch is configured with Docker Volumes.

    Drop your PNGs into the /input folder in this project directory.

    The converted files will automatically appear in the /output folder.

🛠 Troubleshooting for Mac

    Folder Access: If macOS asks "Docker would like to access files in your Desktop/Documents folder," click Allow. This is necessary for the /input and /output folders to sync.

    Port Conflict: If you get an error saying Bind for 0.0.0.0:3000 failed, it means another app is using port 3000. Edit the docker-compose.yml file to change "3000:3000" to "3001:3000".

🧹 Cleanup

To stop the engine and free up resources:
Bash

docker-compose down