# Use an official Node.js runtime as the base image
FROM node:14

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock) to the container
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

EXPOSE 3000

# Serve the built React app using a simple web server
CMD ["npx", "nodemon", "--legacy-watch", "app.js"]

