FROM node:18
WORKDIR /src/
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
EXPOSE 3000
CMD ["node", "src/app.js"]
