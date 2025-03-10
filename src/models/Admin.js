import mongoose from "mongoose";

const adminSchema = new mongoose.Schema(
  {    
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Admin || mongoose.model("Admin", adminSchema);