const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
  type: String,
  name: String,
  location: String,
  description: String,
  dimension: String,
  image: {
    type: String,
    default: '../public/images/location.default.png'
  },
  persons: Number
});

const Place = mongoose.model("Place", placeSchema);
module.exports = Place;