import React from 'react';
import { Link } from 'react-router-dom';
import LoginButton from './login';
import "../style.css";

export default function Navbar() {
  return (
    <nav className='header-container'>
      <h1>CastTrack</h1>
      <div className='nav-links'>
        <Link to="/">Home</Link>
        <Link to="/regulationPage"> Regulations </Link>
        <Link to="/catchPage"> Catch Trends </Link>
        <Link to="/eventPage"> Events/Advisories </Link>
      </div>
      <LoginButton />
    </nav>
  );
}
