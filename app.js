const express = require("express");
const app = express();
const authRoutes = require("./Routes/auth");
const cors = require("cors");

const userRoutes = require("./Routes/userRoutes");
const policyRoutes = require("./Routes/policyRoutes");
const uploadRoutes = require('./Routes/policyRoutes');
//const locationRoutes= require('./Routes/locationRoutes');
const User = require("./Models/User");
const propertyPolicy = require("./Models/propertyPolicy");
//const location = require('./Models/location');
const protectedRoute = require("./Routes/protectedRoute");
const mongoose = require("mongoose");
const { emailTransport } = require("./Controller/emailcontroller");
const config = require("./config/config.json");


const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect(config.MONGODB_URI);

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/policy", policyRoutes);



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
