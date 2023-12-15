// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import { InventoryContext } from '../contexts/InventoryContext';
import CurrentInventoryGraph from '../components/CurrentInventoryGraph';
import CurrentLossGraph from '../components/CurrentLossGraph';
import ProcessConfirmModal from '../components/ProcessConfirmModal';

// The ProcessInventoryDataContainer component is responsible for managing and displaying the inventory data processing interface.
function ProcessInventoryDataContainer() {
  // Use the InventoryContext to get the functions to transfer and donate inventory, and the addedInventory state variable
  const { transferInventory, addedInventory, donateInventory } = useContext(InventoryContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // This effect runs when the addedInventory state variable changes. It calls the transferInventory function.
  // It fills the categoryInventory when rendering the ProcessInventoryDataContainer component
  useEffect(() => {
    if (addedInventory) {
      transferInventory();
    }
  }, [addedInventory, transferInventory]);

  // This function is used to handle the donate button click. It opens the modal.
  const handleDonateClick = () => {
    setIsModalOpen(true);
  };

  // This function is used to handle the confirm donation button click. It calls the donateInventory function and closes the modal.
  // donateInventory() is used to donate inventory items from the categoryInventory API
  // It changes the bucket_name of all remaining 'inventory' to 'donate' and archived to true
  const handleConfirmDonation = () => {
    donateInventory();
    setIsModalOpen(false);
  };

  // Closes modal
  const handleCancelDonation = () => {
    setIsModalOpen(false);
  };

  // The component returns a div that contains the current inventory data, a CurrentLossGraph component, a CurrentInventoryGraph component, a donate button, and a ProcessConfirmModal component if the modal is open.
  // The donate button calls the handleDonateClick function when clicked.
  // The ProcessConfirmModal component calls the handleConfirmDonation function when the confirm button is clicked and the handleCancelDonation function when the cancel button is clicked or the modal is closed.
  return (
    <div className='ProcessInventoryDataContainer'>
        <h3> Current LPD Inventory Data</h3>
        <div className='graphContainer'>
            <div className='lossContainer'>
              <CurrentLossGraph />
            </div>
            <div>
              <CurrentInventoryGraph />
            </div>
        </div>
        <div className='buttonContainer'>
            <button onClick={handleDonateClick}>Donate</button>
        </div>

        {isModalOpen && (
          <ProcessConfirmModal
          onConfirm={handleConfirmDonation}
          onClose={handleCancelDonation}
          >
            <h2>Confirm Donate</h2>
            <h4>*WARNING* Proceeding to donate will clear inventory. This cannot be undone. Proceed with caution!  </h4>
            <div className='ProcessConfirmModalButtons'>
              <button onClick={handleConfirmDonation}>Confirm</button>
              <button onClick={handleCancelDonation}>Cancel</button>
            </div>
          </ProcessConfirmModal>
        )}
    </div>
  )
}

export default ProcessInventoryDataContainer