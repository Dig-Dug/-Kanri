# Use Node 20 Alpine
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source
COPY . .

# Expose Vite port
EXPOSE 5173

# Run Vite in host mode so Docker networking works
CMD ["npm", "run", "dev:frontend", "--", "--host", "0.0.0.0"]
