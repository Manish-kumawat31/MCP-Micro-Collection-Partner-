import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true
  },
  customerAddress: {
    type: String,
    required: true
  },
  customerContact: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed"],
    default: "Pending"
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PickupPartner", // Pickup Partner
    default: null
  },
  mcpId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // MCP
    required: true
  },
  location: {
    latitude: Number,
    longitude: Number
  },
  notes: {
    type: String
  }
} , {Timestamp:true});

export default mongoose.model("Order", orderSchema);
