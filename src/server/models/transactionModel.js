import db from '../config/connect.js';

const findAllTransactions = async () => {
    try {
        const result = await db.pool.query('SELECT * FROM transactions');
        return result.rows;
    } catch (err) {
        console.error('Error fetching products: ', err.message);
        throw err;
    }
};

const createTransaction = async (transactionData) => {
    try {
        const { bucket_name, transaction_weight } = transactionData;
        const weight = Number(transaction_weight);

        if (!transaction_weight || !bucket_name) {
            throw new Error('Missing required fields');
        }

        if (isNaN(weight)) {
            throw new Error('Invalid "transaction_weight": must be an integer');
        }

        const values = [bucket_name, transaction_weight];
        const query = `INSERT INTO transactions
            (bucket_name, transaction_weight)
            VALUES ($1, $2) RETURNING *`;
        const result = await db.pool.query(query, values);
        return result.rows;

    } catch (err) {
        console.error('Error creating Inventory in Model: ', err.message);
        throw err;
    }
};

export default {
    findAllTransactions,
    createTransaction
};