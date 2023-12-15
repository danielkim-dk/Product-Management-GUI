// eslint-disable-next-line no-unused-vars
import React, { useContext, useMemo, useState } from 'react';
import { InventoryContext } from '../contexts/InventoryContext';
import ProcessConfirmModal from '../components/ProcessConfirmModal';

// The ProcessFormContainer component is responsible for managing and displaying the form for processing inventory.
function ProcessFormContainer() {
  // Use the InventoryContext to get the list of category, inventory, and processing categories, and the function to get category inventory
  const { categoryInventory, processCategories, getCategoryInventory } = useContext(InventoryContext);

  // These states are used to manage the input values, errors, whether the modal is open or not, and the changes to confirm
  const [inputValues, setInputValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changesToConfirm, setChangesToConfirm] = useState({});

  // This memoized value is used to calculate the total weight for each category
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

  // This function is used to handle input changes. It checks if the entered weight exceeds the available weight and sets errors accordingly.
  const handleInputChange = (category, value) => {
    // Get the available weight for the category and the entered weight
    const weightAvailable = categoryTotals[category] || 0;
    const enteredWeight = parseFloat(value);

    // If the entered weight is greater than the available weight, add an error for the category
    if (enteredWeight > weightAvailable) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [category]: `Cannot exceed available weight of ${weightAvailable.toFixed(2)} lbs`
      }));
    } else {
      // If the entered weight is less than or equal to the available weight, remove any existing error for the category
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[category];
        return newErrors;
      });
    }

    // Update the input value for the category
    setInputValues(prevValues => ({
      ...prevValues,
      [category]: value
    }));
  };

  // This function is used to handle form submission. It prevents the default form submission behavior, checks for errors, and either opens the modal or shows an alert.
  const handleSubmit = (event) => {
    event.preventDefault();
    
    // If there are no errors, set the changes to confirm and open the modal
    if (Object.keys(errors).length === 0) {
      setChangesToConfirm(inputValues);
      setIsModalOpen(true);
    } else {
      alert("Please correct the errors before proceeding.");
    }
  };

   // This function is used to handle the confirmation of changes. 
   // It processes the categories, clears the input values and errors, closes the modal, and gets the updated category inventory.
  const handleConfirm = async () => {
    const categoriesToProcess = Object.entries(changesToConfirm).map(([category, weight]) => ({
      category,
      weight: parseFloat(weight),
      bucket_name: 'process'
    }));

    // Process the categories
    await processCategories(categoriesToProcess);
    console.log('Confirmed Changes:', changesToConfirm);
    setInputValues({});
    setErrors({});
    setIsModalOpen(false);

    // Clear the input values and errors, and close the modal
    await getCategoryInventory();
  };

  // This function is used to handle the cancellation of changes. It simply closes the modal.
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // This memoized value is used to render the input fields for each category. 
  // It maps over the category totals and creates a div for each category.
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

  // The component returns a form that contains the input fields for each category and a submit button.
  // When the form is submitted, the handleSubmit function is called.
  // If the isModalOpen state variable is true, a ProcessConfirmModal component is also rendered.
  // This component displays a list of the changes to confirm and buttons to confirm or cancel the changes.
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
