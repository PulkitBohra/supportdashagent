import express from 'express';
import { createClient, createOrder } from '../controllers/apiController.js';

const router = express.Router();

router.post('/clients', createClient);
router.post('/orders', createOrder);

export default router;