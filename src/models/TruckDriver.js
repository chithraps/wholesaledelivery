import mongoose from "mongoose";

const truckDriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  assignedVendors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Vendor" }]
},{ timestamps: true })

const TruckDriver = mongoose.models.TruckDriver || mongoose.model("TruckDriver", truckDriverSchema);
export default TruckDriver