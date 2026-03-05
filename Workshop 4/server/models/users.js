const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, unique: true },
    passwordHash: { type: String, required: true },

    // Token guardado en BD (mismo enfoque del ejemplo de clase / semana 4)
    // Se asigna en /auth/token y se valida en el middleware authenticateToken
    token: { type: String, default: null }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);