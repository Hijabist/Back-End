# Base image: Node.js 18 + Debian (bisa install python)
FROM node:18

# Install Python3 & pip
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    ln -s /usr/bin/python3 /usr/bin/python

# Set workdir
WORKDIR /app

# Copy package files dan install dependencies Node.js
COPY package*.json ./
RUN npm install

# Copy semua project files
COPY . .

# (Opsional) Pastikan semua file model, script, dsb masuk ke image

# Expose port Railway (otomatis, tapi best practice)
EXPOSE 3000

# Start Node.js app
CMD ["node", "index.js"]
