// eslint-disable-next-line no-unused-vars
import React from 'react';
import Navbar from '../../components/Navbar';
import CardContainer from '../../containers/ProductContainer';
import './main.css'



function Main() {

  return (
    <>
      <Navbar/>
      <div className='MainPage'>
        <CardContainer/>
      </div>
    </>
  )
}

export default Main