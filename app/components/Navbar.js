'use client'
import React from 'react'
// import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className='w-full p-5 flex justify-between px-28'>
        <div className="con text-2xl font-bold">
            <span>R</span><span className='text-red-500'>T</span><span>O</span>
        </div>
        <ul className='flex text-lg gap-4'>
            <li>Home</li>
            <li>About Us</li>
            <li><a href="/login">Login</a></li>
        </ul>
    </nav>
  )
}

export default Navbar
