// eslint-disable-next-line no-unused-vars
import React, { useContext, useState, useEffect} from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import InventoryCard from '../components/InventoryCard';

function CardContainer({ products }) {
    const { inventory } = useContext(InventoryContext);

    const renderInventoryCards = () => {

        if (!products || products.length === 0) {
            return <div>Loading...</div>;
        }
    

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