import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const gerarToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });
};

export default gerarToken;
