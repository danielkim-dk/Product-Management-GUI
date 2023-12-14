import db from '../config/connect.js';

const findAllProducts = async () => {
    try {
        const result = await db.pool.query('SELECT * FROM products');
        return result.rows;
    } catch (err) {
        console.error('Error fetching products: ', err.message);
        throw err;
    }
};

const createProduct = async productData => {
    try {
        const { product, weight, category, type, upc } = productData;
        if (!product || !category || !type) {
            throw new Error('Missing product, category, or type');
        }

        const values = [product, weight, category, type, upc];
        const query = `INSERT INTO products
            (product, weight, category, type, upc)
            VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (err) {
        console.error('Error creating product: ', err.message);
        throw err;
    }
};

export default {
    findAllProducts,
    createProduct
};