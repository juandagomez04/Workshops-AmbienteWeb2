const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");
const bcrypt = require("bcryptjs");

const { authenticateToken, generateToken } = require("./controllers/auth");

const User = require("./models/users");
const Professor = require("./models/professor");
const Course = require("./models/course");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../client")));

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado ✅"))
    .catch((err) => console.error("Error MongoDB:", err));

// ==========================
// AUTH - REGISTER
// ==========================
app.post("/auth/register", async (req, res) => {
    try {
        const { name, lastName, email, password } = req.body;

        if (!name || !lastName || !email || !password) {
            return res.status(400).json({ message: "Faltan datos: name, lastName, email, password." });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "La contraseña debe tener mínimo 6 caracteres." });
        }

        const exists = await User.exists({ email: email.toLowerCase().trim() });
        if (exists) {
            return res.status(409).json({ message: "Ese email ya está registrado." });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const created = await User.create({
            name: name.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            passwordHash,
            token: null
        });

        // devolvemos sin passwordHash
        res.status(201).json({
            _id: created._id,
            name: created.name,
            lastName: created.lastName,
            email: created.email,
            createdAt: created.createdAt
        });
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// ==========================
// AUTH - TOKEN (LOGIN)
// ==========================
app.post("/auth/token", generateToken);

/* =========================
PROFESORES CRUD
========================= */

// GET
app.get("/professors", authenticateToken, async (req, res) => {
    try {
        const data = await Professor.find().sort({ createdAt: -1 });
        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST
app.post("/professors", authenticateToken, async (req, res) => {
    try {
        const { nombre, apellidos, cedula, edad } = req.body;
        const created = await Professor.create({ nombre, apellidos, cedula, edad });
        res.status(201).json(created);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// PUT
app.put("/professors/:id", authenticateToken, async (req, res) => {
    try {
        const { nombre, apellidos, cedula, edad } = req.body;
        const updated = await Professor.findByIdAndUpdate(
            req.params.id,
            { nombre, apellidos, cedula, edad },
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ message: "Profesor no encontrado" });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// DELETE 
app.delete("/professors/:id", authenticateToken, async (req, res) => {
    try {
        const hasCourses = await Course.exists({ profesorId: req.params.id });
        if (hasCourses) {
            return res.status(409).json({
                message: "No se puede eliminar: este profesor tiene cursos asignados.",
            });
        }

        const deleted = await Professor.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Profesor no encontrado" });
        res.status(204).send();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

/* =========================
CURSOS CRUD
========================= */

// GET
app.get("/courses", authenticateToken, async (req, res) => {
    try {
        const data = await Course.find()
            .populate("profesorId", "nombre apellidos cedula edad")
            .sort({ createdAt: -1 });

        res.json(data);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

// POST
app.post("/courses", authenticateToken, async (req, res) => {
    try {
        const { nombre, codigo, descripcion, profesorId } = req.body;

        const profExists = await Professor.exists({ _id: profesorId });
        if (!profExists) return res.status(400).json({ message: "ProfesorId no existe." });

        const created = await Course.create({ nombre, codigo, descripcion, profesorId });
        res.status(201).json(created);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// PUT 
app.put("/courses/:id", authenticateToken, async (req, res) => {
    try {
        const { nombre, codigo, descripcion, profesorId } = req.body;

        const profExists = await Professor.exists({ _id: profesorId });
        if (!profExists) return res.status(400).json({ message: "ProfesorId no existe." });

        const updated = await Course.findByIdAndUpdate(
            req.params.id,
            { nombre, codigo, descripcion, profesorId },
            { new: true, runValidators: true }
        );

        if (!updated) return res.status(404).json({ message: "Curso no encontrado" });
        res.json(updated);
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});

// DELETE
app.delete("/courses/:id", authenticateToken, async (req, res) => {
    try {
        const deleted = await Course.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Curso no encontrado" });
        res.status(204).send();
    } catch (e) {
        res.status(400).json({ message: e.message });
    }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
