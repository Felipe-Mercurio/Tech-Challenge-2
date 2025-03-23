import express from "express";
import connectDB from "./config/db";
import setupSwagger from "./docs/swagger"; // ✅ Corrigindo a importação
import app from "./app"; // Use a instância de `app` já existente no `app.ts`

const PORT = process.env.PORT || 5000;

// Inicializar Swagger
setupSwagger(app); // ✅ Configura o Swagger

// Conectar ao banco e iniciar o servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
  });
});
