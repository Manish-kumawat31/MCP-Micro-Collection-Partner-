import express from "express";
import { AddFund, getMCPDashboardData, orders, transferFund } from "../controllers/mcp.controller.js";
import { protect } from "../middlewares/protect.middleware.js";
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware.js'

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles('mcp'), getMCPDashboardData);
router.get("/order/:mcpId" , protect , authorizeRoles('mcp') , orders);
router.post('/add-funds' , protect , authorizeRoles('mcp') , AddFund);
router.post('/transfer-funds' , protect , authorizeRoles('mcp') , transferFund);

export default router;
