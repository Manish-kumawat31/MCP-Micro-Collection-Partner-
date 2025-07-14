import express from "express";
import { protect } from "../middlewares/protect.middleware.js";
import { authorizeRoles } from '../middlewares/authorizeRoles.middleware.js'
import { addPartner, deletePartner, getAllPartners, transferFunds, updateCommission, updatePartnerStatus } from "../controllers/partner.controller.js";

const router = express.Router();

router.get('/' , protect , authorizeRoles('mcp') , getAllPartners);
router.post('/' , protect , authorizeRoles('mcp') , addPartner);
router.delete('/:id',protect , authorizeRoles('mcp') , deletePartner);
router.post('/:id/transfer-funds', protect , authorizeRoles('mcp'),transferFunds);
router.patch('/:id/status', protect , authorizeRoles('mcp'),updatePartnerStatus);
router.patch('/:id/commission', protect , authorizeRoles('mcp'),updateCommission);


export default router;
