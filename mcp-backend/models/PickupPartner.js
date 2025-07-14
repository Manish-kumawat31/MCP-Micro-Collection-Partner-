import mongoose from 'mongoose';

const pickupPartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  totalOrders:{
    type: Number,
    default:0,
  },
  assignedOrders: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order'
    }
  ],
  walletBalance : {
    type : Number,
    default: 0
  },
  mcpId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const PickupPartner = mongoose.model('PickupPartner', pickupPartnerSchema);

export default PickupPartner;
