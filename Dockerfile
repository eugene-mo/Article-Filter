FROM node:18
WORKDIR /src/
COPY package*.json ./
RUN npm install
COPY . .
ENV PORT=3000
# default value : true = delete and recreate the database
# false = do not delete and recreate the database
ENV DB_FORCE_SYNC=false 
EXPOSE 3000
CMD ["node", "src/app.js"]
