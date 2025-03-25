# Usa uma imagem oficial do Node.js como base
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos do projeto para dentro do container
COPY package*.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos do projeto
COPY . .

# Expõe a porta da API (defina a mesma porta do seu projeto)
EXPOSE 5000

# Comando para iniciar a API
CMD ["npm", "start"]