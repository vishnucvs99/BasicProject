const mongoose = require("mongoose");

const policySchema = new mongoose.Schema({
  idType:{type:String,required:true},
  insuredType: { type: String, required: true },
  financialYear: { type: Number, required: true },
  insurerName: { type: String, required: true },
  insurerCode: { type: Number, required: true },
  place: { type: String, required: true },
  latitude: { type: Number },
  longitude: { type: Number},
  pan: { type: String, required: true },
  uipi: { type: String,unique: true, required: true },
  policyNumber: { type: Number, required: true },
  policyStartDate: { type: Date, required: true },
  policyEndDate: { type: Date, required: true },
  createdBy: { type: String },
  createdDate: { type: Date, default: Date.now },
  updatedDate: { type: Date },
});

module.exports = mongoose.model("Policy", policySchema);
