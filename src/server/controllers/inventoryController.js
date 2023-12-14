import inventoryModel from "../models/inventoryModel.js";
const inventoryController = {};

inventoryController.createInventory = async (req, res) => {
    try {
        const { product, current_weight, bucket_name, reason } = req.body;

        // Validation
        if (typeof product !== 'string' || typeof bucket_name !== 'string' || typeof reason !== 'string') {
            return res.status(400).json({ message: 'Invalid input types' });
        }

        // Convert current_weight to a number
        const weight = parseFloat(current_weight);
        if (isNaN(weight)) {
            return res.status(400).json({ message: 'current_weight must be a number' });
        }

        const newInventory = await inventoryModel.createInventory({
            product,
            current_weight: weight,
            bucket_name,
            reason 
        });

        return res.status(200).json(newInventory);
    } catch (err) {
        console.error('Error in inventoryController - createInventory: ', err);
        res.status(400).json({ message: 'Error creating inventory in controller'});
    }
};

inventoryController.findAllInventory = async (req, res) => {
    try {
        const allInventory = await inventoryModel.findAllInventory();
        if (allInventory.length === 0) {
            return res.status(200).json({ message: 'No inventory items found' });
        } else {
            return res.status(200).json(allInventory);
        }
    } catch (err) {
        console.error('Error in inventoryController - findAllInventory: ', err);
        return res.status(500).json({ message: 'Internal server error'});
    }
};



export default inventoryController;