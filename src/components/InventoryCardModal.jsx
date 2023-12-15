// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types';
import { InventoryContext } from '../contexts/InventoryContext';
import './Components.css';

// Define the prop types for the InventoryCardModal component
InventoryCardModal.propTypes = {
    handleModalClose: PropTypes.func,
    item: PropTypes.any
}

// The InventoryCardModal component is responsible for managing and displaying the modal for editing an inventory item.
function InventoryCardModal({ handleModalClose, item }) {
    // Use the InventoryContext to get the function to add an inventory item
    const { addInventoryItem } = useContext(InventoryContext);

    // These states are used to manage the input values and errors, and whether the custom reason input is shown
    const [weight, setWeight] = useState(item.weight || '');
    const [bucket, setBucket] = useState(item.bucket || '');
    const [reason, setReason] = useState(item.reason || '');
    const [customReason, setCustomReason] = useState('');
    const [showCustomReasonInput, setShowCustomReasonInput] = useState(false);
    const [category] = useState(item.category);
    const [inputError, setInputError] = useState(false);

    const product = item.product;

    // This function is used to handle reason changes. It checks if the entered reason is '+ add reason' and shows the custom reason input accordingly.
    // TODO: create a table for reasons and update the dropdown of reasons
    const handleReasonChange = (e) => {
        if (e.target.value === '+ add reason') {
            setReason(e.target.value);
            setShowCustomReasonInput(true);
            setCustomReason('');
        } else {
            setShowCustomReasonInput(false);
            setReason(e.target.value);
        }
    }

    // This sets the custom reason to the entered value.
    const handleCustomReasonChange = (e) => {
        setCustomReason(e.target.value);
    };

    // This function is used to handle weight changes. 
    // It checks if the entered weight is a number with up to 2 decimal places and sets the weight and input error accordingly.
    const handleWeightChange = (e) => {
        const value = e.target.value;
        const reg = /^\d*\.?\d{0,2}$/;
        if (reg.test(value)) {
            setWeight(value);
            setInputError(false);
        } else {
            setInputError(true);
        }
    };

    // This sets the bucket to the entered value.
    const handleBucketChange = (bucketValue) => {
        setBucket(bucketValue);
    }

    // This function is used to handle form submission. It prevents the default form submission behavior, checks for input errors, and adds the inventory item.
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Determine the final reason based on whether the custom reason input is shown
        const finalReason = showCustomReasonInput ? customReason : reason;

        // If there is an input error, show an alert and return
        if (inputError) {
            alert('Weight must be a number with up to 2 decimal places');
            return;
        }

        // If any of the fields are empty, show an alert and return
        if (!weight || !bucket || !reason) {
            alert('Please fill out all fields correctly.')
            return;
        }

        // Create the updated item and add it to the inventory
        const updatedItem = { product, weight, category, bucket, reason: finalReason };
        addInventoryItem(updatedItem);

        // Reset the input values and errors, and close the modal
        setWeight(weight || '');
        setBucket('');
        setReason('');
        setCustomReason('');
        setShowCustomReasonInput(false);
        setInputError(false);
        alert('Submitted');
        handleModalClose();
    }

    // The component returns a modal overlay that contains the product title, an image, and a form for editing the inventory item.
    // The form contains an input for the weight, buttons for 'loss' or 'inventory', a reason selector, and a submit button.
    // When the form is submitted, the handleSubmit function is called.
    return (
        <div className='modal-overlay'>
            <div className='modal'>
                <div className='modalTitle'><h2>{product}</h2></div>
                <div className='imgHolder'>
                    <img src='' alt='Meat Image' width={600} height={300} />
                </div>
                <div className='modalForm'>
                    <input 
                        id='modalFormInput'
                        type='number'
                        placeholder='Input Weight in XX.XX Format'
                        value={weight}
                        onChange={handleWeightChange}
                        className={inputError ? 'inputError' : ''}
                        step='0.01'
                    />
                    <div className='lossInventoryButtonDiv'>
                        <button 
                            id='lossButton' 
                            className={bucket === 'loss' ? 'lossSelected' : ''} 
                            onClick={() => handleBucketChange('loss')}
                        >
                            Loss
                        </button>
                        <button 
                            id='inventoryButton' 
                            className={bucket === 'inventory' ? 'inventorySelected' : ''} 
                            onClick={() => handleBucketChange('inventory')}
                        >
                            Inventory
                        </button>
                    </div>
                    <select 
                        className='reasonSelector'
                        value={reason}
                        onChange={handleReasonChange}
                    >
                        <option value=''>Choose a Reason</option>
                        <option value='Freezer Burn'>Freezer Burn</option>
                        <option value='Ripped Package'>Ripped Package</option>
                        <option value='+ add reason'> + add reason</option>
                    </select>
                    {showCustomReasonInput && (
                        <input
                            id='modalFormInput'
                            type='text'
                            placeholder='Enter Custom Reason'
                            value={customReason}
                            onChange={handleCustomReasonChange}
                        />
                    )}
                </div>
                <div className='submitCancelBtnContainer'>
                    <button id='modalSubmit' onClick={handleSubmit}>Submit</button>
                    <button id='modalCancel' onClick={handleModalClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
}

export default InventoryCardModal