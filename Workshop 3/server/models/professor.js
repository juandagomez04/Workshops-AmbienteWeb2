const mongoose = require("mongoose");

const professorSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true },
        apellidos: { type: String, required: true, trim: true },
        cedula: { type: String, required: true, trim: true, unique: true },
        edad: { type: Number, required: true, min: 0 },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Professor", professorSchema);
