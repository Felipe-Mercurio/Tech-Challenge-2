"use strict";
console.log("✅ Servidor iniciando...");
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("./config/db"));
const swagger_1 = __importDefault(require("./docs/swagger")); // ✅ Corrigindo a importação
const app_1 = __importDefault(require("./app")); // Use a instância de `app` já existente no `app.ts`
const PORT = process.env.PORT || 5000;
// Inicializar Swagger
(0, swagger_1.default)(app_1.default); // ✅ Configura o Swagger
// Conectar ao banco e iniciar o servidor
(0, db_1.default)().then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
    });
});
