"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupSwagger;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const user_docs_1 = require("./user.docs");
const post_docs_1 = require("./post.docs");
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
        paths: Object.assign(Object.assign({}, user_docs_1.userDocs), post_docs_1.postDocs)
    },
    apis: ["./src/routes/*.ts"], // Certifique-se de que está correto
};
// Gerar documentação Swagger
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
// Função para configurar Swagger no Express
function setupSwagger(app) {
    app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
    app.get("/api-docs-json", (req, res) => {
        res.json(swaggerDocs);
    });
}
