const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        nombre: { type: String, required: true, trim: true },
        codigo: { type: String, required: true, trim: true, unique: true },
        descripcion: { type: String, required: true, trim: true },
        profesorId: { type: mongoose.Schema.Types.ObjectId, ref: "Professor", required: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
