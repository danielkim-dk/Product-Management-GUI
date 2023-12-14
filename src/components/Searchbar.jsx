// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';

function Searchbar({ onInputChange }) {

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