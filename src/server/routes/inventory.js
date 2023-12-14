import express from 'express';
import inventoryController from '../controllers/inventoryController.js';

const router = express.Router();


router.get('/', inventoryController.findAllInventory);

router.post('/createInventory', inventoryController.createInventory)

export default router;