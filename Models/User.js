const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  userName: { type: String, unique: true, required: true },
  password: { type: String ,require:true},

  address: { type: String },
  mobileNumber: { type: String },
  telephoneNumber: { type: String },
  faxNumber: { type: Number },
  emailId: { type: String, unique: true, required: true },
  insurerCode: { type: Number },

  role: {
    type: String,
    enum: ["IIBAdmin", "InsurerUser", "InsurerAdmin"],
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String },
  createdDate: { type: Date },
  updatedDate: { type: Date },
});

module.exports = mongoose.model("User", userSchema);
