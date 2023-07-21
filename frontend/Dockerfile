# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /frontend

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Expose the port on which your React app will run (typically 80 for HTTP)
EXPOSE 80

# Serve the built React app using a simple web server
CMD ["npm", "start"]
