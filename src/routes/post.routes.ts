import express, { Response, NextFunction } from "express";
import Post from "../models/post.model";
import protegerRota, { AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

// Criar uma nova postagem (Apenas usuários autenticados)
router.post("/", protegerRota, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }

    const { titulo, conteudo, materia } = req.body;

    const novaPostagem = new Post({
      titulo,
      conteudo,
      autor: req.usuario._id,
      materia,
    });

    await novaPostagem.save();
    res.status(201).json(novaPostagem);
    return;
  } catch (error) {
      res.status(500).json({ message: "Erro ao criar postagem", error})
  }
});

// Listar todas as postagens
router.get("/", protegerRota, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }
    const postagens = await Post.find().populate("autor", "nome email");
    res.json(postagens);
    return;
  } catch (error) {
     res.status(500).json({ message: "Erro ao listar postagens", error})
  }
});

// Buscar postagem por ID
router.get("/:id", protegerRota, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.usuario) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }
    const postagem = await Post.findById(req.params.id).populate("autor", "nome email");
    if (!postagem) {
      res.status(404).json({ message: "Postagem não encontrada" });
      return;
    }
    res.json(postagem);
    return;
  } catch (error) {
      res.status(500).json({ message: "Erro ao buscar postagem", error})
  }
});

// Atualizar postagem (Apenas professores podem editar)
router.put("/:id", protegerRota, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
      res.status(403).json({ message: "Apenas professores podem editar postagens" });
      return;
    }

    const postagemAtualizada = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!postagemAtualizada) {
      res.status(404).json({ message: "Postagem não encontrada" });
      return;
    }

    res.json(postagemAtualizada);
    return;
  } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar postagem", error})
  }
});

// Deletar postagem (Apenas professores podem excluir)
router.delete("/:id", protegerRota, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
      res.status(403).json({ message: "Apenas professores podem excluir postagens" });
      return;
    }

    const postagemDeletada = await Post.findByIdAndDelete(req.params.id);

    if (!postagemDeletada) {
      res.status(404).json({ message: "Postagem não encontrada" });
      return;
    }

    res.json({ message: "Postagem deletada com sucesso!" });
    return;
  } catch (error) {
      res.status(500).json({ message: "Erro ao deletar postagem", error})
  }
});

export default router;
