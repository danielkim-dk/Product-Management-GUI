import categoryInventoryModel from "../models/categoryInventoryModel.js";

const categoryInventoryController = {};

categoryInventoryController.findAllNonArchivedInventory = async (req, res) => {
    try {
        const allNonArchivedInventory = await categoryInventoryModel.findAllNonArchivedInventory();
        if (allNonArchivedInventory.length === 0) {
            return res.status(200).json({ message: 'No inventory items found' });
        } else {
            // res.locals.inventory = allNonArchivedInventory;
            // return next();
            return res.status(200).json(allNonArchivedInventory);
        }
    } catch (err) {
        console.error('Error in categoryInventoryController - findAllNonArchivedInventory: ', err);
        res.status(500).json({ message: 'Error in fetching non archived inventory: ', error: err.message });
    }
};

categoryInventoryController.transferInventory = async (req, res) => {
    try {
        const { transferredItems, processedItemsCount } = await categoryInventoryModel.transferInventoryProcess();
        res.status(200).json({
            message: 'Transfer successful',
            transferredItems: transferredItems,
            processedItemsCount: processedItemsCount
        });
    } catch (err) {
        console.error('Error in categoryInventoryController - transferInventory: ', err);
        res.status(500).json({ message: 'Error in inventory transfer: ', error: err.message });
    }
};

categoryInventoryController.processInventory = async (req, res) => {
    try {
        const data = req.body;
        const processData = await categoryInventoryModel.processInventory(data);

        res.status(200).json({
            message: "Processing successful",
            processData: processData
        });
    } catch (err) {
        console.error('Error in categoryInventoryController - processInventory: ', err);
        res.status(500).json({ message: "Error processing inventory: ", error: err.message });
    }
};

categoryInventoryController.donateInventoryItems = async (req, res) => {
    try {
        const result = await categoryInventoryModel.donateInventoryItems();
        res.status(200).json({
            message: 'Inventory donated successfully',
            result
        });
    } catch (err) {
        console.error('Error in categoryInventoryController - donateInventory: ', err);
        res.status(500).json({ message: 'Error donating inventory: ', error: err.message });
    }
};


export default categoryInventoryController;

