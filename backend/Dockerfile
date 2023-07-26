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

# Expose the port on which your application will run
EXPOSE 5050

# Start the application directly without using the entrypoint script
CMD ["npx", "nodemon", "--legacy-watch", "app.js"]

