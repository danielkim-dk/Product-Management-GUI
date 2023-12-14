// eslint-disable-next-line no-unused-vars
import React from 'react';
import Navbar from '../../components/Navbar';
import ProcessInventoryDataContainer from '../../containers/ProcessInventoryDataContainer';
import ProcessFormContainer from '../../containers/ProcessFormContainer';
import './process.css';

function Process() {

  return (
    <>
      <Navbar/>
      <div className="ProcessPage">
        <div>
          <ProcessInventoryDataContainer />
          <ProcessFormContainer />
        </div>
      </div>
    </>
  )
}

export default Process