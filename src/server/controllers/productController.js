import productModel from '../models/productModel.js';

const productController = {};

productController.findAllProducts = async (req, res) => {
    try {
        const allProducts = await productModel.findAllProducts();
        res.json(allProducts);
    } catch (err) {
        console.error('Error in productController - findAllProducts: ', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export default productController;
