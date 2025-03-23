"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const PostSchema = new mongoose_1.default.Schema({
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    autor: { type: mongoose_1.default.Schema.Types.ObjectId, ref: "User", required: true },
    materia: { type: String, required: true }, // Exemplo: "Matemática", "Ciências"
    ativo: { type: Boolean, default: true },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Post", PostSchema);
