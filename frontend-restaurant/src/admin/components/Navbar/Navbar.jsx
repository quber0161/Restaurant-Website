/* eslint-disable no-unused-vars */
import React, { useContext } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { StoreContext } from '../../../user/context/StoreContext'

const Navbar = () => {
  const { logout} = useContext(StoreContext);
  return (
    <div className='navbar-admin'>
        <img className='logo' src={assets.logo} alt="" />
        <h1>ADMIN</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
    </div>
  )
}

export default Navbar
