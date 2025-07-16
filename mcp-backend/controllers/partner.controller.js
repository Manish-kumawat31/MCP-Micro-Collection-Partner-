import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";
import userModel from "../models/user.model.js";


// GET all partners
export const getAllPartners = async (req, res) => {
    try {
      const mcpId = req.user._id;
      const partners = await PickupPartner.find({mcpId:mcpId});
      res.json(partners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch partners" });
    }
  };
  
  // POST new partner
  export const addPartner = async (req, res) => {
    const { name } = req.body;
    try {
      const partner = new PickupPartner({ name,mcpId: req.user._id, status: 'active' });
      await partner.save();
      res.status(201).json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to add partner" , error });
    }
  };

  // DELETE a partner
export const deletePartner = async (req, res) => {
    await PickupPartner.findByIdAndDelete(req.params.id);
    let orderTo = await Order.findOneAndUpdate({assignedTo:req.params.id} , {assignedTo:null},{new:true});
    res.json({ message: 'Partner deleted' });
  };
  
// POST transfer funds
export const transferFunds = async (req, res) => {
    const { amount } = req.body;
    const partner = await PickupPartner.findById(req.params.id);
    const mcp = await userModel.findById(req.user.id);
  
    if (mcp.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }
  
    // Transfer
    mcp.walletBalance -= amount;
    partner.walletBalance += amount;
  
    await mcp.save();
    await partner.save();
  
    res.json({ message: 'Funds transferred successfully' });
  };

  // PATCH partner status
  export const updatePartnerStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const partner = await PickupPartner.findByIdAndUpdate(id, { status }, { new: true });
      if (!partner) {
        return res.status(404).json({ message: "Partner not found" });
      }
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  };

  // PATCH update commission
export const updateCommission = async (req, res) => {
    const { commission } = req.body;
    await Partner.findByIdAndUpdate(req.params.id, { commission });
    res.json({ message: 'Commission updated' });
  };