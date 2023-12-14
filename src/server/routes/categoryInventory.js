import express from 'express';
import categoryInventoryController from '../controllers/categoryInventoryController.js';

const router = express.Router();

router.get('/', categoryInventoryController.findAllNonArchivedInventory);

router.post('/transfer', categoryInventoryController.transferInventory);

router.post('/process', categoryInventoryController.processInventory);

router.post('/donate', categoryInventoryController.donateInventoryItems);

export default router;
