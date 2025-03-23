import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcrypt";

// Interface para o usuário
export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;  // ← Adicione esta linha!
  nome: string;
  email: string;
  senha: string;
  tipo: "Administrador" | "Professor" | "Aluno";
  compararSenha(senhaDigitada: string): Promise<boolean>;
}

// Esquema do usuário
const UserSchema = new Schema<IUser>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true },
    tipo: { type: String, enum: ["Administrador", "Professor", "Aluno"], required: true },
  },
  { timestamps: true }
);

// Antes de salvar, criptografar a senha
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("senha")) return next();
  const salt = await bcrypt.genSalt(10);
  this.senha = await bcrypt.hash(this.senha, salt);
  next();
});

// Método para comparar senha digitada com a senha criptografada
UserSchema.methods.compararSenha = async function (senhaDigitada: string) {
  return bcrypt.compare(senhaDigitada, this.senha);
};

const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default User;
