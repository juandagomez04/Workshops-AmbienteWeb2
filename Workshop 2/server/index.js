require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Course = require("./models/course");

const app = express(); // ✅ app primero

app.use(express.json());
app.use(cors());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB conectado ✅"))
    .catch((err) => console.error("Error MongoDB:", err));

// POST - crear
app.post("/course", async (req, res) => {
    try {
        const course = new Course({
            name: req.body.name,
            credits: req.body.credits,
        });

        const courseCreated = await course.save();
        res.status(201).json(courseCreated);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// GET - listar todos
app.get("/course", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT - actualizar
app.put("/course/:id", async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                credits: req.body.credits,
            },
            { new: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        res.json(updatedCourse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE - eliminar
app.delete("/course/:id", async (req, res) => {
    try {
        const deletedCourse = await Course.findByIdAndDelete(req.params.id);

        if (!deletedCourse) {
            return res.status(404).json({ message: "Curso no encontrado" });
        }

        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ listen SIEMPRE al final
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API corriendo en puerto ${PORT}`));
