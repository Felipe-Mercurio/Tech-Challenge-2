"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};

Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const router = express_1.default.Router();


// Criar Novo Usuario
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nome, email, senha, tipo } = req.body;
        const novoUsuario = new user_model_1.default({ nome, email, senha, tipo });
        yield novoUsuario.save();
        res.status(201).json(novoUsuario);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao criar usuário", error });
    }
}));
// Listar todos os usuários
router.get("/", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return;
        }
        const usuarios = yield user_model_1.default.find();
        res.json(usuarios);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao listar usuários", error });
    }
}));
// Buscar usuário por ID
router.get("/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return;
        }
        const usuario = yield user_model_1.default.findById(req.params.id);
        if (!usuario) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        res.json(usuario);
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao buscar usuário", error });
    }
}));
// Atualizar usuário por ID (Apenas administradores)
router.put("/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario || req.usuario.tipo !== "Administrador") {
            res.status(403).json({ message: "Apenas administradores podem editar usuários" });
            return;
        }
        const usuarioAtualizado = yield user_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!usuarioAtualizado) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        res.json(usuarioAtualizado);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao atualizar usuário", error });
    }
}));
// Deletar usuário por ID (Apenas administradores)
router.delete("/:id", authMiddleware_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario || req.usuario.tipo !== "Administrador") {
            res.status(403).json({ message: "Apenas administradores podem excluir usuários" });
            return;
        }
        const usuarioDeletado = yield user_model_1.default.findByIdAndDelete(req.params.id);
        if (!usuarioDeletado) {
            res.status(404).json({ message: "Usuário não encontrado" });
            return;
        }
        res.json({ message: "Usuário deletado com sucesso!" });
        return;
    }
    catch (error) {
        next(error); // ✅ Agora o erro é tratado corretamente
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, senha } = req.body;
        const usuario = yield user_model_1.default.findOne({ email });
        if (!usuario) {
            res.status(401).json({ message: "Credenciais inválidas" });
            return;
        }
        // 🔐 Verifique se a senha está correta
        const senhaValida = yield bcrypt_1.default.compare(senha, usuario.senha);
        if (!senhaValida) {
            res.status(401).json({ message: "Credenciais inválidas" });
            return;
        }
        // 🔑 Gerar o token JWT
        const token = jsonwebtoken_1.default.sign({ _id: usuario._id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo }, process.env.JWT_SECRET, { expiresIn: "2h" });
        res.json({ token, usuario: { _id: usuario._id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo } });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao autenticar usuário", error });
    }
}));
exports.default = router;
