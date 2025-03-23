import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User, { IUser } from "../models/user.model";  // ← Importa a interface correta
import mongoose from "mongoose";

export interface AuthRequest extends Request {
  usuario?: {
    _id: string;
    nome: string;
    email: string;
    tipo: "Administrador" | "Professor" | "Aluno";
  };
}

const protegerRota = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Acesso negado, token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { _id: string };
    
    const usuario = await User.findById(decoded._id).select("_id nome email tipo");

    if (!usuario) {
      res.status(401).json({ message: "Usuário não encontrado" });
      return;
    }

    req.usuario = {
      _id: usuario._id.toString(),
      nome: usuario.nome,
      email: usuario.email,
      tipo: usuario.tipo as "Administrador" | "Professor" | "Aluno",
    };

    next(); // ✅ Agora o middleware SEMPRE chama `next()`
  } catch (error) {
    res.status(401).json({ message: "Token inválido", error });
  }
};


export default protegerRota;
