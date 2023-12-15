// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InventoryCardModal from './InventoryCardModal';

// Defines the prop types for the InventoryCard component
InventoryCard.propTypes = {
  item: PropTypes.any.isRequired
}

// The InventoryCard component represents a single inventory item.
// It includes a modal that can be opened to view more details about the item. 
function InventoryCard({ item }) {
    // This state is used to control whether the modal is open or not
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Function to open the modal
    const handleModalOpen = () => {
      console.log('Opening modal...')
      setIsModalOpen(true);
    };

    // Function to close the modal
    const handleModalClose = () => {
      console.log('Closing modal...');
      setIsModalOpen(false);
    };

    // The component returns a div that displays the item's name and an image placeholder.
    // When the div is clicked, the modal is opened.
    // If the modal is open, the InventoryCardModal component is also rendered.    
    return (
      <>
          <div className="inventoryCard" onClick={handleModalOpen}>
              <h1> image here </h1>
              <p>Name: {item.product}</p>
          </div>
          {isModalOpen && (
            <InventoryCardModal
            handleModalClose={handleModalClose}
            item={item}
            />
          )}
      </>
    );
}

export default InventoryCard;

