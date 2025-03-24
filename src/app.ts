import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";
import authRoutes from "./routes/auth.routes";

const app = express();

// Middleware para permitir JSON no `req.body`
app.use(express.json());
app.use(cors());

// Definir as rotas da API
app.use("/users", userRoutes);
app.use("/posts", postRoutes);
app.use("/auth", authRoutes);


export default app;
