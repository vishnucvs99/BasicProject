const Location = require("../Models/location");
const fetch = require('node-fetch');

const addLocation = async (req, res) => {
  const { address } = req.body;

  try {
    // Use a geocoding service to get latitude and longitude based on the address
    const geocodingAPIKey = "AIzaSyAPsvFajBSIh2SV-AjkY9uJoGHQHqKRjto";
    const geocodingEndpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${geocodingAPIKey}`;

    const response = await fetch(geocodingEndpoint);
    const data = await response.json();
    
    console.log(data);

    if (data.results.length > 0) {
      const { lat, lng } = data.results[0].geometry.location;

      // Save location data to MongoDB
      const newLocation = new Location({
        address,
        latitude: lat,
        longitude: lng,
      });

      await newLocation.save();

      res.json({
        success: true,
        message: "Location added successfully",
        location: newLocation,
      });
    } else {
      res.json({
        success: false,
        message: "Unable to find coordinates for the given address",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = { addLocation };
