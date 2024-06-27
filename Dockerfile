# Use the official Node.js image.
FROM node:18-alpine3.20

# Create and change to the app directory.
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

# Install dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the NestJS application.
RUN npm run build

# Run the web service on container startup.
CMD [ "node", "dist/main.js" ]

# Inform Docker that the container listens on the specified port.
EXPOSE 4000
