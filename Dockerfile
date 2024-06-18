# Étape de construction pour installer les dépendances
FROM node:21 AS builder

WORKDIR /app

# Copier les fichiers de package.json et package-lock.json
COPY ./app/package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application
COPY ./app .

# Construire l'application NestJS
RUN npm run build

# Image de production
FROM node:21

WORKDIR /app

# Copier les fichiers de l'étape de construction précédente
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

# Exposer le port sur lequel l'application écoute
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "./dist/main.js"]
