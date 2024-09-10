# Step 1: Use Node.js as the base image
FROM node:18-alpine

# Step 2: Set the working directory in the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json
COPY package*.json ./

# Step 4: Install the project dependencies
RUN npm install

# Step 5: Copy the rest of the application code
COPY . .

# Step 6: Build the NestJS application
RUN npm run build

# Step 7: Expose the application port (default is 3000)
EXPOSE 3000

# Step 8: Define the default command to run your app
CMD ["npm", "run", "start:prod"]
