// eslint-disable-next-line no-unused-vars
import React from 'react';

// The Searchbar component is a controlled component that takes in a function as a prop to set the searchKeyword state variable.
// This component is used to filter the products state variable in the ProductContainer component.
function Searchbar({ onInputChange }) {
  // The component returns an input field.
  // When the value of the input field changes, the onInputChange function is called with the new value.
  // This function is expected to update the state of the parent component.
  return (
    <div className='searchbar'>
      <input 
        id='searchbarInput'
        type="text"
        placeholder="Search by keyword or scan barcode"
        onChange={(e) => onInputChange(e.target.value)}
      />
    </div>
  )
}

export default Searchbar;