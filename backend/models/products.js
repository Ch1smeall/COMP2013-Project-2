//intitialize schema
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//create model schema
const grocerySchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  productName: {
    type: String,
    required: true
  },
  brand: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  }
});

//package and export the model
const Product = mongoose.model("Product", grocerySchema, "groceryItem");
module.exports = Product;