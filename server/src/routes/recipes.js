// serverside for recipe sharing

const express = require("express");
const router = express.Router();
const { Recipe } = require("../models");

router.get("/share/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id).lean();

        if (!recipe) {
            return res.status(404).send("No Recipe");
        }

        res.json(recipe);
    } catch (err) {
        console.error("Error fetching share recipe:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { title, ingredients, instructions } = req.body;
        
        const recipe = await Recipe.findByIdAndUpdate(
            req.params.id,
            { title, ingredients, instructions },
            { new: true }
        );

        if (!recipe) {
            return res.status(404).send("Recipe not found");
        }

        res.json(recipe);
    } catch (err) {
        console.error("Error updating recipe:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const recipe = await Recipe.findByIdAndDelete(req.params.id);

        if (!recipe) {
            return res.status(404).send("Recipe not found");
        }

        res.json({ message: "Recipe deleted successfully" });
    } catch (err) {
        console.error("Error deleting recipe:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;