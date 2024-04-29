const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const mediaSchema = new mongoose.Schema({
  url: String,
  type: String
});

const instructionSchema = new mongoose.Schema({
  step: String,
  description: String
});

const ingredientSchema = new mongoose.Schema({
  name: String,
  quantity: String
});

const recipeSchema = new mongoose.Schema({
  title: String,
  ingredients: [ingredientSchema],
  media: [mediaSchema],
  instructions: [instructionSchema],
  category: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User' } 
}, { timestamps: true }); 

const Recipe = mongoose.model('Recipe', recipeSchema);
module.exports = Recipe;
