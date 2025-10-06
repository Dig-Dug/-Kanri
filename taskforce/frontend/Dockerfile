# frontend/Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copy package.json & package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Expose port used by Vite
EXPOSE 5173

# Start dev server
CMD ["npm", "run", "dev"]
