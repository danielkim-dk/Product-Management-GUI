import transactionModel from "../models/transactionModel.js";

const transactionController = {};

transactionController.findAllTransactions = async (req, res) => {
    try {
        const allTransactions = await transactionModel.findAllTransactions();
        res.status(200).json(allTransactions);
    } catch (err) {
        console.error('Error in transactionController - findAllTransactions: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

transactionController.createTransaction = async (req, res) => {
    try {
        const { bucket_name, transaction_weight } = req.body;

        // Validation
        // if (typeof bucket_name !== 'string') {
        //     return res.status(400).json({ message: 'Invalid input types' });
        // }

        const weight = parseFloat(transaction_weight);
        if (isNaN(weight)) {
            return res.status(400).json({ message: 'transaction_weight must be a number' });
        }

        const newTransaction = await transactionModel.createTransaction({
            transaction_weight: weight,
            bucket_name
        });
        return res.status(200).json(newTransaction);
    } catch (err) {
        console.error('Error in transactionController - createTransaction: ', err);
        res.status(400).json({ message: 'Error creating transaction in controller'});
    }
};


export default transactionController;