// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from 'react';

export const InventoryContext = createContext();

//TODO: create state to track loading and error states to display in UI

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([]);
    const [categoryInventory, setCategoryInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [addedInventory, setAddedInventory] = useState(false);

    const updateInventoryItem = (updatedItem) => {
        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
    };

    const addInventoryItem = async (inventoryItem) => { 
        const item = { 
            product: inventoryItem.product, 
            current_weight: parseFloat(inventoryItem.weight), 
            bucket_name: inventoryItem.bucket,
            reason: inventoryItem.reason
        };
        console.log(item)
        try {
            const response = await fetch(`http://localhost:3002/api/inventory/createInventory`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item),
            });
            const data = await response.json();
            console.log(data);
        } catch (err) {
            console.error(err);
        }
        setInventory(prevInventory => [...prevInventory, inventoryItem]);
        setAddedInventory(true);
    }

    const getProducts = async () => {
        try {
            const response = await fetch(`http://localhost:5173/api/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const allProducts = await response.json();
            // console.log('Products List: ', allProducts);
            setProducts(allProducts);
        } catch (err) {
            console.error('Error in getProducts Fetch: ', err)
        }
    };

    const getInventory = async () => {
        try {
            const response = await fetch(`http://localhost:5173/api/inventory`);
            const allInventory = await response.json();
            // console.log('Inventory List: ', allInventory);
            setInventory(allInventory);
        } catch (err) {
            console.error('Error in getInventory Fetch: ', err)
        }
    };

    const transferInventory = async () => {
        console.log('transfer inventory running')
        try {
            const response = await fetch(`http://localhost:5173/api/categoryInventory/transfer`, {
                method: 'POST',  // Specify the method
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // const { transferredItems, processedItemsCount } = await response.json();
            // console.log('transferredItems: ', transferredItems)
        } catch (err) {
            console.error('Error during inventory transfer: ', err);
        } finally {
            setAddedInventory(false);
        }
    };

    const getCategoryInventory = async () => {
        try {
            const response = await fetch(`http://localhost:5173/api/categoryInventory`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const updatedCategoryInventory = await response.json();

            if (updatedCategoryInventory.message === "No inventory items found") {
                setCategoryInventory([]);
            } else {
                setCategoryInventory(updatedCategoryInventory);
            }
    
        } catch (err) {
            console.error('Error during category inventory transfer: ', err);
        }
    };

    const processCategories = async (categoriesData) => {
        try {
          const response = await fetch(`http://localhost:5173/api/categoryInventory/process`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(categoriesData),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          // Handle the response here, e.g., updating state or showing a success message
          console.log("Categories processed successfully");
        } catch (err) {
          console.error('Error during processing categories: ', err);
        }
    };

    const donateInventory = async () => {
        try {
            const response = await fetch(`http://localhost:5173/api/categoryInventory/donate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result.message);
                setCategoryInventory([]);
            } else {
                throw new Error('Failed to donate inventory');
            }
            
        } catch (err) {
            console.error('Error during donation process:', err);
        }
    };

    
    useEffect(() => {
        getCategoryInventory();
    }, [addedInventory]);

    useEffect(() => {
        getInventory();
    }, []);

    useEffect(() => {
        getProducts();
    }, []);

    useEffect(() => {
        if (products && products.length > 0) {
            const uniqueCategories = Array.from(new Set(products.map(product => product.category)));
            setCategories(uniqueCategories);
        }
    }, [products]);

    return (
        <InventoryContext.Provider value={{ 
            inventory, 
            getInventory, 
            setInventory,
            addedInventory,
            updateInventoryItem, 
            products, 
            getProducts, 
            categories, 
            addInventoryItem,
            transferInventory,
            categoryInventory,
            getCategoryInventory,
            processCategories,
            donateInventory,
            setCategoryInventory
             }}>
            {children}
        </InventoryContext.Provider>
    );
};