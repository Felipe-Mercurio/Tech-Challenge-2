import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

/**
 * @swagger
 * /auth/validate:
 *   post:
 *     summary: Verifica se o token JWT é válido ou expirou
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token válido
 *       401:
 *         description: Token expirado ou inválido
 */
router.post("/validate", async (req: Request, res: Response): Promise<void> => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    res.status(401).json({ message: "Token não fornecido" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

    res.json({ valid: true, message: "Token válido", decoded });
    return;
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      res.status(401).json({ valid: false, message: "Token expirado" });
      return;
    }
    res.status(401).json({ valid: false, message: "Token inválido" });
    return;
  }
});

export default router;
