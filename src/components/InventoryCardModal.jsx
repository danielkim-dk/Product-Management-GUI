// eslint-disable-next-line no-unused-vars
import React, { useContext, useState } from 'react'
import PropTypes from 'prop-types';
import { InventoryContext } from '../contexts/InventoryContext';
import './Components.css';

InventoryCardModal.propTypes = {
    handleModalClose: PropTypes.func,
    item: PropTypes.any
}

function InventoryCardModal({ handleModalClose, item }) {
    const { addInventoryItem } = useContext(InventoryContext);
    const [weight, setWeight] = useState(item.weight || '');
    const [bucket, setBucket] = useState(item.bucket || '');
    const [reason, setReason] = useState(item.reason || '');
    const [customReason, setCustomReason] = useState('');
    const [showCustomReasonInput, setShowCustomReasonInput] = useState(false);
    const [category] = useState(item.category);
    const [inputError, setInputError] = useState(false);

    const product = item.product;

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

    const handleCustomReasonChange = (e) => {
        setCustomReason(e.target.value);
    };

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

    const handleBucketChange = (bucketValue) => {
        setBucket(bucketValue);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalReason = showCustomReasonInput ? customReason : reason;

        if (inputError) {
            alert('Weight must be a number with up to 2 decimal places');
            return;
        }

        if (!weight || !bucket || !reason) {
            alert('Please fill out all fields correctly.')
            return;
        }

        const updatedItem = { product, weight, category, bucket, reason: finalReason };
        addInventoryItem(updatedItem);

        setWeight(weight || '');
        setBucket('');
        setReason('');
        setCustomReason('');
        setShowCustomReasonInput(false);
        setInputError(false);
        alert('Submitted');
        handleModalClose();
    }

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