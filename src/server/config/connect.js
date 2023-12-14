import pkg from 'pg';
import dotenv from 'dotenv';
const {Pool} = pkg;


dotenv.config();

let PG_URL = process.env.PG_URL

const pool = new Pool({
    connectionString: PG_URL
})

const createTables = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                product_id SERIAL PRIMARY KEY,
                product VARCHAR(255) NOT NULL UNIQUE,
                weight DECIMAL,
                category VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                upc VARCHAR(255)
            );
        `);
    
        await pool.query(`
            CREATE TABLE IF NOT EXISTS inventory (
                inventory_id SERIAL PRIMARY KEY,
                product VARCHAR(255) NOT NULL REFERENCES products(product),
                current_weight DECIMAL,
                bucket_name VARCHAR(255) NOT NULL,
                reason VARCHAR(255) NOT NULL,
                input_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                processed BOOLEAN DEFAULT FALSE
            );
        `)
        
        await pool.query(`
            CREATE TABLE IF NOT EXISTS categoryInventory (
                catInv_id SERIAL PRIMARY KEY,
                bucket_name VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                weight DECIMAL NOT NULL, 
                input_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                archived BOOLEAN DEFAULT FALSE NOT NULL
            )
        `)

        await pool.query(`
            CREATE TABLE IF NOT EXISTS transactions (
                transaction_id SERIAL PRIMARY KEY,
                bucket_name VARCHAR(255) NOT NULL,
                transaction_weight DECIMAL NOT NULL,
                transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
            );
        `);

    console.log('Tables created successfully');
    } catch (err) {
        console.error('Failed to create tables: ', err);
    }
};

if (process.env.NODE_ENV !== 'test') {
    createTables();
}

const query = (text, params) => pool.query(text, params);

export default {
    pool,
    query,
    createTables,
};