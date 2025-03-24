import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/validate", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token não fornecido" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // O token é válido, então retornamos sucesso
    return res.json({ valid: true, message: "Token válido", decoded });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ valid: false, message: "Token expirado" });
    }
    return res.status(401).json({ valid: false, message: "Token inválido" });
  }
}));

export default router;
