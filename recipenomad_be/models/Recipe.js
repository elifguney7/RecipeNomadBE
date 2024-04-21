const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  instructions: String,
  category: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true }); 

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
