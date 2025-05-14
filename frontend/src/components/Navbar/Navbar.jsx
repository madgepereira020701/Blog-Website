import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import { FaBars } from 'react-icons/fa6';
import { FaAngleDown } from 'react-icons/fa';
import { FaHeartbeat } from 'react-icons/fa';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [userinitials, setUserInitials] = useState('');
  const [isOthersDropDownOpen, setIsOthersDropDownOpen] = useState(false);

  useEffect(() => {
    const storedUserName = localStorage.getItem('userName');
    const storedUserRole = localStorage.getItem('role'); // Retrieve role from localStorage
  
    if (storedUserName) {
      const initials = storedUserName.split(' ').map((word) => word[0]).join('');
      setUserInitials(initials.toUpperCase());
      //setUser(storedUserName);
    }
    if (storedUserRole) {
      setRole(storedUserRole); // Set role correctly
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const toggleOthersDropDown = () => {
    setIsOthersDropDownOpen(!isOthersDropDownOpen);
  };

  const logout = () => {
    localStorage.removeItem('token'); // Remove token on logout
    localStorage.removeItem('userName'); // Remove user data on logout
    localStorage.removeItem('role'); // Remove role data on logout
    window.location.href = '/'; // Redirect to login page
  };


  return (
    <nav className="nav">
      <div className="company-title">
        <h2>
          <FaHeartbeat style={{ color: 'red', marginRight: '8px' }} /> Blog World
        </h2>
      </div>
      <ul className={isOpen ? 'nav-links active' : 'nav-links'}>
    <>
      <li><NavLink to="/posts" className={({ isActive }) => isActive ? 'active' : ''}>Posts</NavLink></li>
      <li><NavLink to="/addpost" className={({ isActive }) => isActive ? 'active' : ''}>Create Post</NavLink></li>
    </>
        <li className="account" onClick={toggleDropDown}>
          {userinitials ? userinitials : 'Guest'} <FaAngleDown />
          {isDropDownOpen && (
            <ul className="dropdown active : dropdown">
              <li><NavLink onClick={logout} className={({ isActive }) => isActive ? 'active' : ''}>Log out</NavLink></li>
            </ul>
          )}
        </li>
      </ul>
      <div className="icon" onClick={toggleMenu}>
        <FaBars />
      </div>
    </nav>
  );
};

export default Navbar;
