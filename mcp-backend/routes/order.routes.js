import express from "express";
import {createOrder,assignOrder,getOrders,getOrderReport,getOrdersByPartner,updateOrderStatus} from "../controllers/order.controller.js";

const router = express.Router();

router.post("/", createOrder); 
router.get("/", getOrders);
router.get("/partner/:id", getOrdersByPartner);
router.patch("/assign", assignOrder); 
router.patch("/status/:id", updateOrderStatus); 
router.get("/report", getOrderReport);

export default router;
