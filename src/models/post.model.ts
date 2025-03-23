import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    conteudo: { type: String, required: true },
    autor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materia: { type: String, required: true }, // Exemplo: "Matemática", "Ciências"
    ativo: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
