import express from 'express';
import { login, logout, signup ,checkAuth } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/protect.middleware.js';

const router = express.Router();

router.post('/signup' , signup )
router.post('/login' , login )
router.post('/logout' , logout )
router.get('/check' ,protect  , checkAuth )

export default router;