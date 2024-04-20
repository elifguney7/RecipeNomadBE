const mongoose = require('mongoose');

// const ingredientSchema = new mongoose.Schema({
//     name: String,
//     quantity: String
//   });
const mediaSchema = new mongoose.Schema({
  url: String,
  type: String
});

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: String,
  media: [mediaSchema],
  instructions: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
