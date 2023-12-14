import React, { useContext, useMemo, useState } from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import ProcessConfirmModal from '../components/ProcessConfirmModal';

function ProcessFormContainer() {
  const { categoryInventory, processCategories, getCategoryInventory } = useContext(InventoryContext);
  const [inputValues, setInputValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changesToConfirm, setChangesToConfirm] = useState({});

  // Calculate the total weight for each category

  const categoryTotals = useMemo(() => {
    const totals = {};

    const filteredInventory = categoryInventory.filter(item => item.bucket_name === 'inventory');
    filteredInventory.forEach(item => {
      const weight = parseFloat(item.total_weight);
      if (!isNaN(weight)) {
        totals[item.category] = (totals[item.category] || 0) + weight;
      }
    });

    return totals;
  }, [categoryInventory]);

  const handleInputChange = (category, value) => {
    const weightAvailable = categoryTotals[category] || 0;
    const enteredWeight = parseFloat(value);

    if (enteredWeight > weightAvailable) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [category]: `Cannot exceed available weight of ${weightAvailable.toFixed(2)} lbs`
      }));
    } else {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[category];
        return newErrors;
      });
    }

    setInputValues(prevValues => ({
      ...prevValues,
      [category]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (Object.keys(errors).length === 0) {
      setChangesToConfirm(inputValues);
      setIsModalOpen(true);
    } else {
      alert("Please correct the errors before proceeding.");
    }
  };

  const handleConfirm = async () => {
    const categoriesToProcess = Object.entries(changesToConfirm).map(([category, weight]) => ({
      category,
      weight: parseFloat(weight),
      bucket_name: 'process'
    }));

    await processCategories(categoriesToProcess);
    console.log('Confirmed Changes:', changesToConfirm);
    setInputValues({});
    setErrors({});
    setIsModalOpen(false);

    await getCategoryInventory();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const productCategories = useMemo(() => Object.keys(categoryTotals).map((category, index) => (
    <div key={index} className='categoryInputContainer'>
      <label>
        <div>
        {category} (limit: {categoryTotals[category].toFixed(2)} lbs):
        {errors[category] && <div className="errorMessage">{errors[category]}</div>}
        </div>
        <input 
          type='number' 
          name={category} 
          placeholder='Input Weight to Transfer'
          value={inputValues[category] || ''}
          onChange={(e) => handleInputChange(category, e.target.value)}
          step='0.01'
        />
      </label>
    </div>
  )), [categoryTotals, inputValues, errors]);

  return (
    <div className='ProcessFormContainer'>
      <h3> Transfer to Process Form</h3>
      <form onSubmit={handleSubmit}>
        {productCategories}
        <div className='buttonContainer'>
          <button type="submit">Process</button>
        </div>
      </form>

      {isModalOpen && (
        <ProcessConfirmModal className='ProcessConfirmModal' onClose={handleCancel}>
          <div className='processConfirmModalDiv'>
            <h2>Confirm Changes</h2>
            <ul>
              {Object.entries(changesToConfirm).map(([category, value]) => (
                <li key={category}>{category}: {value} lbs</li>
              ))}
            </ul>
            <div className='ProcessConfirmModalButtons'>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </ProcessConfirmModal>
      )}
    </div>
  )
}

export default ProcessFormContainer;
