import User from "../models/user.model.js";
import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";

export const getMCPDashboardData = async (req, res) => {
  try {
    const mcpId = req.user._id;

    // 1. MCP Wallet Balance
    const mcp = await User.findById(mcpId);
    const walletBalance = mcp.walletBalance;

    // 2. Pickup Partners under MCP
    const partners = await PickupPartner.find({ mcpId: mcpId });
    const pickupPartners = partners.map(partner => ({
      name: partner.name,
      status: partner.status,
      totalOrders: partner.totalOrders
    }));

    // 3. Order Stats for these partners
    const totalOrders = await Order.countDocuments({ mcpId });

    // Completed orders for this MCP
    const completed = await Order.countDocuments({
      mcpId,
      status: /completed/i
    });

    // Pending orders for this MCP
    const pending = await Order.countDocuments({
      mcpId,
      status: /pending/i
    });





    res.status(200).json({
      walletBalance,
      pickupPartners,
      orders: { total: totalOrders, completed, pending }
    });

  } catch (error) {
    console.log("Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }



  // try {
  //  // Example dummy data, tu real database se la sakta hai
  //   const mcpId = req.user._id;
  //   const mcp = await User.findById(mcpId);
  //   const walletBalance = mcp.walletBalance || 0;

  //   const orders = {
  //     total: 100,
  //     completed: 70,
  //     pending: 30
  //   };

  //   const pickupPartners = [
  //     { name: 'John Doe', status: 'active', assignedOrders: 10 },
  //     { name: 'Jane Smith', status: 'inactive', assignedOrders: 5 }
  //   ];

  //   res.status(200).json({
  //     walletBalance,
  //     orders,
  //     pickupPartners
  //   });
  // } catch (error) {
  //   res.status(500).json({ message: error.message });
  // }
};
export const orders = async (req, res) => {
  try {
    const orders = await Order.find({ mcpId: req.params.mcpId })
      .sort({ createdAt: -1 })
      .populate('assignedTo', 'name');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const AddFund = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount." });
    }

    const mcp = await User.findById(req.user._id); // Assuming req.user.id is MCP ID
    if (!mcp) {
      return res.status(404).json({ message: "MCP not found." });
    }

    mcp.walletBalance += amount;
    await mcp.save();

    return res.status(200).json({ message: "Funds added successfully.", newWalletBalance: mcp.walletBalance });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error while adding funds." });
  }
}

export const transferFund = async (req, res) => {
  try {
    const { partnerId, amount } = req.body;
    const mcpId = req.user._id;

    const mcp = await User.findById(mcpId);
    const partner = await PickupPartner.findById(partnerId);

    if (!mcp || !partner) {
      return res.status(404).json({ message: "MCP or Partner not found" });
    }

    if (mcp.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct from MCP wallet
    mcp.walletBalance -= amount;
    await mcp.save();

    // Add to Partner wallet
    partner.walletBalance += amount;
    await partner.save();

    res.status(200).json({ newWalletBalance: mcp.walletBalance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
