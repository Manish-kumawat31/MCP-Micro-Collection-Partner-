import Order from "../models/Order.js";
import PickupPartner from "../models/PickupPartner.js";
import mongoose from "mongoose";
import moment from "moment";

// Create Order
export const createOrder = async (req, res) => {
  const { customerId, address } = req.body;

  try {
    const order = new Order({ customerId, address });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Failed to create order", error: err });
  }
};

// Get All Orders
export const getOrders = async (req, res) => {
  try {
    const mcpId = req.user._id;
    
    const orders = await Order.find({mcpId : mcpId}).populate("assignedTo", "name");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// Assign Order
export const assignOrder = async (req, res) => {
  const { orderId, partnerId } = req.body;

  try {
    // Update the order and assign to partner
    const order = await Order.findByIdAndUpdate(
      orderId,
      { assignedTo: partnerId, status: "In Progress" },
      { new: true }
    ).populate('assignedTo');

    // Atomically increment totalOrders of the pickup partner
    const partner = await PickupPartner.findByIdAndUpdate(
      partnerId,
      { $inc: { totalOrders: 1 } },
      { new: true }
    );

    console.log(partner);
    
    // Send both updated order and partner in response
    res.json({ order, partner });

  } catch (err) {
    res.status(500).json({ message: "Failed to assign order", error: err.message });
    console.log(err.message);
    
  }
};


// Get Orders for Specific Partner
export const getOrdersByPartner = async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.params.id });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Failed to get partner orders" });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const oldorder = await Order.findById(id);
    if (!oldorder) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (oldorder.assignedTo && status === "Pending") {
      return res.status(400).json({ message: "Status cannot be changed to Pending after assigning to a Partner" });
    }

    const orderUpdate = await Order.findByIdAndUpdate(id, { status }, { new: true });
    res.json(orderUpdate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update status", error: err.message });
  }
};


// Generate Report
export const getOrderReport = async (req, res) => {
  const range = req.query.range || 'daily';
  const startDate = range === 'weekly' ? moment().subtract(7, 'days') : moment().startOf('day');

  try {
    const report = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate.toDate() } } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);
    
    console.log(report);
    res.json(report);
  } catch (err) {
    res.status(500).json({ message: "Failed to generate report" });
  }
};
