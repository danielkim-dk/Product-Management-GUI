// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import InventoryCardModal from './InventoryCardModal';

InventoryCard.propTypes = {
  item: PropTypes.any.isRequired
}

function InventoryCard({ item }) {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleModalOpen = () => {
      console.log('Opening modal...')
      setIsModalOpen(true);
    }
    const handleModalClose = () => {
      console.log('Closing modal...');
      setIsModalOpen(false);
  };

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

