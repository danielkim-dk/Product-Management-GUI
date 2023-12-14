// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect} from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import InventoryCard from '../components/InventoryCard';

function CardContainer({ products }) {
    const { inventory } = useContext(InventoryContext);

    const renderInventoryCards = () => {
        // Check if products is undefined or an empty array
        if (!products || products.length === 0) {
            // Render a placeholder or loading indicator
            return <div>Loading...</div>; // or any other placeholder you prefer
        }
    
        // If products is available, proceed to map over it
        return products.map((product, index) => (
            <InventoryCard key={index} item={product} />
        ));
    };

    return (
        <div className='cardContainer'>
            {renderInventoryCards()}
        </div>
    )
}

export default CardContainer