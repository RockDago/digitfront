FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Dépendances
COPY package*.json ./
RUN npm install

# Code source
COPY . .

# Port React
EXPOSE 3000

# Lancement React
CMD ["npm", "start"]
