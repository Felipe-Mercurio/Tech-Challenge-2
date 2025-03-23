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
const post_model_1 = __importDefault(require("../models/post.model"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const router = express_1.default.Router();
// Criar uma nova postagem (Apenas usuários autenticados)
router.post("/", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return;
        }
        const { titulo, conteudo, materia } = req.body;
        const novaPostagem = new post_model_1.default({
            titulo,
            conteudo,
            autor: req.usuario._id,
            materia,
        });
        yield novaPostagem.save();
        res.status(201).json(novaPostagem);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao criar postagem", error });
    }
}));
// Listar todas as postagens
router.get("/", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return;
        }
        const postagens = yield post_model_1.default.find().populate("autor", "nome email");
        res.json(postagens);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao listar postagens", error });
    }
}));
// Buscar postagem por ID
router.get("/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario) {
            res.status(401).json({ message: "Usuário não autenticado" });
            return;
        }
        const postagem = yield post_model_1.default.findById(req.params.id).populate("autor", "nome email");
        if (!postagem) {
            res.status(404).json({ message: "Postagem não encontrada" });
            return;
        }
        res.json(postagem);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao buscar postagem", error });
    }
}));
// Atualizar postagem (Apenas professores podem editar)
router.put("/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
            res.status(403).json({ message: "Apenas professores podem editar postagens" });
            return;
        }
        const postagemAtualizada = yield post_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!postagemAtualizada) {
            res.status(404).json({ message: "Postagem não encontrada" });
            return;
        }
        res.json(postagemAtualizada);
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao atualizar postagem", error });
    }
}));
// Deletar postagem (Apenas professores podem excluir)
router.delete("/:id", authMiddleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
            res.status(403).json({ message: "Apenas professores podem excluir postagens" });
            return;
        }
        const postagemDeletada = yield post_model_1.default.findByIdAndDelete(req.params.id);
        if (!postagemDeletada) {
            res.status(404).json({ message: "Postagem não encontrada" });
            return;
        }
        res.json({ message: "Postagem deletada com sucesso!" });
        return;
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao deletar postagem", error });
    }
}));
exports.default = router;
