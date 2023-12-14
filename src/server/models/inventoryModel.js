import db from '../config/connect.js';

const findAllInventory = async () => {
    try {
        const result = await db.pool.query('SELECT * FROM inventory');
        return result.rows;
    } catch (err) {
        console.error('Error fetching products: ', err.message);
        throw err;
    }
};

const createInventory = async (inventoryData) => {
    try {
        const { product, current_weight, bucket_name, reason } = inventoryData;
        const weight = Number(current_weight);

        if (!current_weight || !bucket_name || !reason) {
            throw new Error('Missing required fields');
        }

        if (isNaN(weight)) {
            throw new Error('Invalid "current_weight": must be an integer');
        }

        const values = [product, current_weight, bucket_name, reason];
        const query = `INSERT INTO inventory
            (product, current_weight, bucket_name, reason)
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const result = await db.pool.query(query, values);
        return result.rows;

    } catch (err) {
        console.error('Error creating Inventory in Model: ', err.message);
        throw err;
    }
}

export default {
    findAllInventory,
    createInventory
}