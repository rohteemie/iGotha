# Use the official Node.js image as a base
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /iGotha/backend/

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install --production

# Copy the application code
COPY . .

# Expose the port your app runs on (e.g., 3000)
EXPOSE 3500

# Define the command to run your app
CMD ["node", "server.js"]
