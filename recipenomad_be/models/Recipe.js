const mongoose = require('mongoose');

// const ingredientSchema = new mongoose.Schema({
//     name: String,
//     quantity: String
//   });
  
  const recipeSchema = new mongoose.Schema({
    title: String,
    ingredients: String,
    media: [{
      url: String,
      type: String
    }],
    instructions: String
  });
  
  const Recipe = mongoose.model('Recipe', recipeSchema);
  module.exports = Recipe;
  