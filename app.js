const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

const API_URL = "https://www.thecocktaildb.com/api/json/v1/1";

// Home page
app.get("/", (req, res) => {
    res.render("index", {
        error: null
    });
});

// Search for a cocktail
app.post("/search", async (req, res) => {
    const cocktailName = req.body.cocktail;

    if (!cocktailName || cocktailName.trim() === "") {
        return res.render("index", {
            error: "Please enter a cocktail name."
        });
    }

    try {
        const response = await axios.get(
            `${API_URL}/search.php`,
            {
                params: {
                    s: cocktailName.trim()
                }
            }
        );

        const drinks = response.data.drinks;

        if (!drinks) {
            return res.render("index", {
                error: `No cocktail found for "${cocktailName}". Please try another name.`
            });
        }

        const drink = drinks[0];

        const ingredients = [];

        for (let i = 1; i <= 15; i++) {
            const ingredient = drink[`strIngredient${i}`];
            const measure = drink[`strMeasure${i}`];

            if (ingredient && ingredient.trim() !== "") {
                ingredients.push({
                    ingredient: ingredient.trim(),
                    measure: measure ? measure.trim() : ""
                });
            }
        }

        res.render("result", {
            drink: drink,
            ingredients: ingredients
        });

    } catch (error) {
        console.error("API Error:", error.message);

        res.render("index", {
            error: "Something went wrong while contacting the cocktail API. Please try again."
        });
    }
});


app.listen(PORT, () => {
    console.log(`Cocktail Finder is running at http://localhost:${PORT}`);
});
