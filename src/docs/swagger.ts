import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express, Request, Response } from "express";
import { userDocs } from "./user.docs";
import { postDocs } from "./post.docs";

// Configuração do Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Ou "2.0" se necessário para OutSystems
    info: {
      title: "MongoDB APIs",
      version: "1.0.0",
      description: "API para integração com OutSystems",
    },
    servers: [{ url: "http://localhost:5000" }], // Ajuste conforme necessário
    paths: {
      ...userDocs,
      ...postDocs
    }
  },
  apis: ["./src/routes/*.ts"], // Certifique-se de que está correto
};

// Gerar documentação Swagger
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Função para configurar Swagger no Express
export default function setupSwagger(app: Express) {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

  app.get("/api-docs-json", (req: Request, res: Response) => {
    res.json(swaggerDocs);
  });
}
