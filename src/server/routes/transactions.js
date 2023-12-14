import express from 'express';
import transactionController from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', transactionController.findAllTransactions);

router.post('/createTransaction', transactionController.createTransaction, (req, res) => {
    res.status(201).json(res.locals.transaction)
})

export default router;