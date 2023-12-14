import db from '../config/connect.js';

const findAllNonArchivedInventory = async () => {
    try {
        const result = await db.pool.query(`
        WITH processed_inventory AS (
            SELECT category, SUM(weight) AS total_weight
            FROM categoryInventory
            WHERE bucket_name = 'process' AND archived = FALSE
            GROUP BY category
        ),
        inventory AS (
            SELECT category, SUM(weight) AS total_weight
            FROM categoryInventory
            WHERE bucket_name = 'inventory' AND archived = FALSE
            GROUP BY category
        ),
        loss AS (
            SELECT category, SUM(weight) AS total_weight
            FROM categoryInventory
            WHERE bucket_name = 'loss' AND archived = FALSE
            GROUP BY category
        )
        SELECT 
            i.category, 
            'inventory' AS bucket_name, 
            (i.total_weight - COALESCE(pi.total_weight, 0)) AS total_weight
        FROM inventory i
        LEFT JOIN processed_inventory pi ON i.category = pi.category
        UNION ALL
        SELECT category, 'loss' AS bucket_name, total_weight
        FROM loss;
    `);
        return result.rows;
    } catch (err) {
        console.error('Error fetching Category Inventory: ', err.message);
        throw err;
    }
};

const processInventory = async (data) => {
    const query = `
        INSERT INTO categoryInventory (bucket_name, category, weight)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = data.map(item => [item.bucket_name, item.category, item.weight]);
    
    try {
        const results = [];
        for (const value of values) {
            const result = await db.pool.query(query, value);
            results.push(result.rows[0]);
        }
        return results;
    } catch (err) {
        console.error('Error inserting processed data:', err.message);
        throw err;
    }
};

const transferToCategoryInventory = async () => {
    const transferQuery = `
        INSERT INTO categoryInventory (bucket_name, category, weight)
        SELECT inv.bucket_name, prod.category, SUM(inv.current_weight)
        FROM inventory inv
        JOIN products prod ON inv.product = prod.product
        WHERE inv.processed = FALSE
        GROUP BY inv.bucket_name, prod.category
        RETURNING *;
    `;
    try {
        const result = await db.pool.query(transferQuery);
        return result.rows;
    } catch (err) {
        console.error('Error in transferToCategoryInventory: ', err.message);
        throw err;
    }
};

const markInventoryAsProcessed = async () => {
    const updateQuery = `
        UPDATE inventory
        SET processed = TRUE
        WHERE processed = FALSE;
    `;
    try {
        const result = await db.pool.query(updateQuery);
        return result.rowCount;
    } catch (err) {
        console.error('Error in markInventoryAsProcessed: ', err.message);
        throw err;
    }
}

const transferInventoryProcess = async () => {
    try {
        await db.pool.query('BEGIN');

        const transferredItems = await transferToCategoryInventory();
        const processedItemsCount = await markInventoryAsProcessed();

        await db.pool.query('COMMIT');

        return { transferredItems, processedItemsCount };
    } catch (err) {
        await db.pool.query('ROLLBACK');
        throw err;
    }
};

const donateInventoryItems = async () => {
    const updateInventoryQuery = `
        UPDATE categoryInventory
        SET bucket_name = 'donate', archived = TRUE
        WHERE bucket_name = 'inventory' AND archived = FALSE;
    `;

    const archiveLossQuery = `
        UPDATE categoryInventory
        SET archived = TRUE
        WHERE bucket_name = 'loss' AND archived = FALSE;
    `;

    const archiveProcessQuery = `
        UPDATE categoryInventory
        SET archived = TRUE
        WHERE bucket_name = 'process' AND archived = FALSE;
    `;

    try {
        await db.pool.query('BEGIN');

        const inventoryResult = await db.pool.query(updateInventoryQuery);
        const lossResult = await db.pool.query(archiveLossQuery);
        const processResult = await db.pool.query(archiveProcessQuery);


        await db.pool.query('COMMIT');

        return { 
            inventoryArchivedCount: inventoryResult.rowCount, 
            lossArchivedCount: lossResult.rowCount,
            processArchivedCount: processResult.rowCount
        };
    } catch (err) {
        await db.pool.query('ROLLBACK');
        console.error('Error in donateInventoryItems: ', err.message);
        throw err;
    }
};


export default {
    transferToCategoryInventory,
    markInventoryAsProcessed,
    transferInventoryProcess,
    findAllNonArchivedInventory,
    processInventory, 
    donateInventoryItems
}