# 1. Start with the Node.js "Engine"
FROM node:20-slim

# 2. Install 'libvips' (Sharp needs this to process images on Linux)
RUN apt-get update && apt-get install -y libvips-dev && rm -rf /var/lib/apt/lists/*

# 3. Create a folder inside the container for our app
WORKDIR /usr/src/app

# 4. Copy the package files first (to make building faster next time)
COPY package*.json ./

# 5. Install the dependencies inside the container
RUN npm install --production

# 6. Copy all your code (server.js, index.html, etc.)
COPY . .

# 7. Make the input/output folders exist inside the container
RUN mkdir -p input output

# 8. Tell Docker to open Port 3000
EXPOSE 3000

# 9. The command to start the app
CMD ["node", "server.js"]