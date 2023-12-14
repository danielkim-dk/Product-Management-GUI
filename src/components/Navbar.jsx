// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';
import './Components.css';

function Navbar() {
  return (
    <nav className='Navbar'>
        <Link to="/">Home</Link>
        <Link to="/process">Process</Link>
        <Link to="/statistics">Statistics</Link>
    </nav>
  )
}

export default Navbar