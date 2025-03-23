"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const post_routes_1 = __importDefault(require("./routes/post.routes"));
const app = (0, express_1.default)();
// Middleware para permitir JSON no `req.body`
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Definir as rotas da API
app.use("/users", user_routes_1.default);
app.use("/posts", post_routes_1.default);
exports.default = app;
