FROM node:10.9.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 8080
CMD ["npm", "run", "serve"]
