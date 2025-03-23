import express, { Request, Response } from "express";
import User from "../models/user.model";
import protegerRota, { AuthRequest } from "../middleware/authMiddleware";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Criar Novo Usuario
router.post("/",  async (req: Request, res: Response): Promise<void> => {
  try {
      const { nome, email, senha, tipo } = req.body;
      const novoUsuario = new User({ nome, email, senha, tipo });
      await novoUsuario.save();
      res.status(201).json(novoUsuario);
  } catch (error) {
      res.status(500).json({ message: "Erro ao criar usuário", error });
  }
});

// Listar todos os usuários
router.get("/", protegerRota, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }
    const usuarios = await User.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ message: "Erro ao listar usuários", error });
  }
});

// Buscar usuário por ID
router.get("/:id", protegerRota, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.usuario || (req.usuario.tipo !== "Administrador" && req.usuario.tipo !== "Professor")) {
      res.status(401).json({ message: "Usuário não autenticado" });
      return;
    }
    const usuario = await User.findById(req.params.id);
    if (!usuario) {
      res.status(404).json({ message: "Usuário não encontrado" });
      return;
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar usuário", error });
  }
});

// Atualizar usuário por ID (Apenas administradores)
router.put("/:id", protegerRota, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
      if (!req.usuario || req.usuario.tipo !== "Administrador") {
          res.status(403).json({ message: "Apenas administradores podem editar usuários" });
          return;
      }

      const usuarioAtualizado = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

      if (!usuarioAtualizado) {
          res.status(404).json({ message: "Usuário não encontrado" });
          return;
      }

      res.json(usuarioAtualizado);
      return;
  } catch (error) {
      res.status(500).json({ message: "Erro ao atualizar usuário", error });
  }
});


// Deletar usuário por ID (Apenas administradores)
router.delete("/:id", protegerRota, async (req: AuthRequest, res: Response, next): Promise<void> => {
  try {
      if (!req.usuario || req.usuario.tipo !== "Administrador") {
          res.status(403).json({ message: "Apenas administradores podem excluir usuários" });
          return;
      }

      const usuarioDeletado = await User.findByIdAndDelete(req.params.id);
      if (!usuarioDeletado) {
          res.status(404).json({ message: "Usuário não encontrado" });
          return;
      }

      res.json({ message: "Usuário deletado com sucesso!" });
      return;
  } catch (error) {
      next(error); // ✅ Agora o erro é tratado corretamente
  }
});

router.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, senha } = req.body;

    const usuario = await User.findOne({ email });
    if (!usuario) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    // 🔐 Verifique se a senha está correta
    const senhaValida = await bcrypt.compare(senha, usuario.senha);

    if (!senhaValida) {
      res.status(401).json({ message: "Credenciais inválidas" });
      return;
    }

    // 🔑 Gerar o token JWT
    const token = jwt.sign(
      { _id: usuario._id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
      process.env.JWT_SECRET as string,
      { expiresIn: "2h" }
    );

    res.json({ token, usuario: { _id: usuario._id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo } });
  } catch (error) {
    res.status(500).json({ message: "Erro ao autenticar usuário", error });
  }
});


export default router;
