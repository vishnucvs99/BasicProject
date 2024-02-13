const mongoose= require('mongoose')
const locationSchema = new mongoose.Schema({
    address: String,
    latitude: Number,
    longitude: Number,
    pincode: String,
  });
  
  const Location = mongoose.model('Location', locationSchema);
  
  module.exports = Location;