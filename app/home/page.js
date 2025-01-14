<<<<<<< HEAD
import React from 'react'

const page = () => {
  return (
    <div>
      <a href="/register-army" className='text-[30px]'>register as army</a>
    </div>
  )
}

export default page
=======
'use client'
import { useState } from 'react'
import Navbar from '../components/Navbar.js'
// import { useRouter } from 'next/router.js'
import { useRouter } from 'next/navigation.js'

const page=()=> {

    const router = useRouter(); // Initialize the router

    const handleNavigation = (path) => {
      router.push(path); // Navigate to the specified path
    };

  return (
    <>
        <Navbar/>
        <div className="hero w-full flex flex-col items-center mt-24 gap-5">
          <div className="title text-5xl flex flex-col w-full items-center font-bold">
            <span>Welcome to</span>
            <span>Regional Transport Office</span>
          </div>
          <div className="desc text-gray-700">Lorem ipsum dolor sit amet consectetur adipisicing hello elit. Minima odit eligendi hello baccho  </div>

          <div className="search flex w-[70%] justify-center">

          </div>
        </div>
        <div className="buttons mt-10 text-center">
        <button type="button" onClick={()=>handleNavigation('/login')} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Login as Job Seeker</button>
        <button type="button" onClick={()=>handleNavigation('/army/register')} className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Register as Military Personell</button>
        </div>
    </>
  )
}

export default page;
>>>>>>> 41b5eada0f6b047f39d258407327fffd25152c7c
