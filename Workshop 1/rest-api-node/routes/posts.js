const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// GET ALL
router.get("/", async (req, res) => {
    try {
        const posts = await Post.find();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET BY ID
router.get("/:postId", async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        res.json(post);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// CREATE
router.post("/", async (req, res) => {
    const post = new Post({
        title: req.body.title,
        description: req.body.description
    });

    try {
        const savedPost = await post.save();
        res.status(201).json(savedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// UPDATE
router.patch("/:postId", async (req, res) => {
    try {
        const updatedPost = await Post.updateOne(
            { _id: req.params.postId },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description
                }
            }
        );
        res.json(updatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE
router.delete("/:postId", async (req, res) => {
    try {
        const removedPost = await Post.deleteOne({ _id: req.params.postId });
        res.json(removedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
