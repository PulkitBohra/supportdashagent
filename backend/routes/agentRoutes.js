import express from 'express';
import { handleSupportQuery, handleDashboardQuery } from '../controllers/agentController.js';

const router = express.Router();

router.post('/support', handleSupportQuery);
router.post('/dashboard', handleDashboardQuery);

export default router;