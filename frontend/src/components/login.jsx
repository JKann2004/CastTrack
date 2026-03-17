import React from 'react';

export default function LoginButton() {
    function Clicked() {
        alert('Transporting to login page');
    }
    return (
    <button className='right-button'>
        Login
    </button>
  );
}
