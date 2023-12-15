// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from 'react';

// Used by components to access and modify global state
export const InventoryContext = createContext();

//TODO: create state to track loading and error states to display in UI

// Provider component that wraps app and makes global state available to all components
export const InventoryProvider = ({ children }) => {
    // These are the global state variables that will be made available to all components
    const [inventory, setInventory] = useState([]);
    const [categoryInventory, setCategoryInventory] = useState([]);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [addedInventory, setAddedInventory] = useState(false);

    // This function is used to an existing inventory item
    // Currently not in use 
    const updateInventoryItem = (updatedItem) => {
        setInventory(prevInventory =>
            prevInventory.map(item =>
                item.id === updatedItem.id ? updatedItem : item
            )
        );
    };

    // This function is used to add a new inventory item
    // Currently takes data from inventoryCardModal and does a POST request to the inventory API 
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

    // This function is used to get all products from the products API
    // Used at initial render to populate the products state variable
    const getProducts = async () => {
        try {
            const response = await fetch(`http://localhost:5173/api/products`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const allProducts = await response.json();
            setProducts(allProducts);
        } catch (err) {
            console.error('Error in getProducts Fetch: ', err)
        }
    };

    // This function is used to get all inventory items from the inventory API
    // Used at initial render to populate the inventory state variable
    const getInventory = async () => {
        try {
            const response = await fetch(`http://localhost:5173/api/inventory`);
            const allInventory = await response.json();
            setInventory(allInventory);
        } catch (err) {
            console.error('Error in getInventory Fetch: ', err)
        }
    };

    // This function is used to transfer inventory items from the inventory API to the categoryInventory API
    // Currently triggers when ProcessInventoryDataContainer renders -- when moving from main page to process page
    // It only triggers when the addedInventory state is true
    const transferInventory = async () => {
        console.log('transfer inventory running')
        try {
            const response = await fetch(`http://localhost:5173/api/categoryInventory/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

        } catch (err) {
            console.error('Error during inventory transfer: ', err);
        } finally {
            setAddedInventory(false);
        }
    };

    // This function is used to get all category inventory items from the categoryInventory API
    // It triggers when addedInventory state changes or when we confirm to process inventory in ProcessFormContainer
    // If no inventory items are found, we set the categoryInventory state to an empty array
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

    // This function is used to process inventory items from the categoryInventory API
    // It triggers when we confirm to process inventory in ProcessFormContainer
    // It changes the bucket_name of the bucket_name from 'inventory' to 'processed'
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
      
          console.log("Categories processed successfully");
        } catch (err) {
          console.error('Error during processing categories: ', err);
        }
    };

    // This function is used to donate inventory items from the categoryInventory API
    // It triggers when we confirm to donate inventory in ProcessFormContainer
    // It changes the bucket_name of all remaining 'inventory' to 'donate' and archived to true
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

    // fills global state variables on render / changes in addedInventory state
    useEffect(() => {
        getCategoryInventory();
    }, [addedInventory]);

    useEffect(() => {
        getInventory();
    }, []);

    useEffect(() => {
        getProducts();
    }, []);

    // sets categories state variable on render / changes in products state 
    // TODO: need to refactor when changing to real database
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