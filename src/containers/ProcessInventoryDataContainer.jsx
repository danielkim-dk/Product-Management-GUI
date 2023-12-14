// eslint-disable-next-line no-unused-vars
import React, { useContext, useEffect, useState } from 'react'
import { InventoryContext } from '../contexts/InventoryContext';
import CurrentInventoryGraph from '../components/CurrentInventoryGraph';
import CurrentLossGraph from '../components/CurrentLossGraph';
import ProcessConfirmModal from '../components/ProcessConfirmModal';




function ProcessInventoryDataContainer() {
  const { transferInventory, addedInventory, donateInventory } = useContext(InventoryContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (addedInventory) {
      transferInventory();
    }
  }, [addedInventory, transferInventory]);

  const handleDonateClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmDonation = () => {
    donateInventory();
    setIsModalOpen(false);
  };

  const handleCancelDonation = () => {
    setIsModalOpen(false);
  };

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