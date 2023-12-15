// eslint-disable-next-line no-unused-vars
import React from 'react';
import InventoryCard from '../components/InventoryCard';

// The CardContainer component is a child of the ProductContainer component.
// It is responsible for rendering the InventoryCard components.
// It takes in the products state variable as a prop.
function CardContainer({ products }) {
    // This function is used to render the InventoryCard components.
    // If the products array is empty or not defined, it renders a loading message.
    // Otherwise, it maps over the products array and creates an InventoryCard component for each product.
    const renderInventoryCards = () => {

        if (!products || products.length === 0) {
            return <div>Loading...</div>;
        }
    
        return products.map((product, index) => (
            <InventoryCard key={index} item={product} />
        ));
    };

    // The component returns a div that contains the rendered InventoryCard components.
    return (
        <div className='cardContainer'>
            {renderInventoryCards()}
        </div>
    )
}

export default CardContainer