FROM node:14-alpine
WORKDIR /app
COPY src ./src
COPY *.json ./
RUN npm install
COPY . .
EXPOSE $PORT
ENTRYPOINT ["npm", "run", "prod"]