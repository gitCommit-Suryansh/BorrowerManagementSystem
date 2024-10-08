import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/images/logo.png'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <img src={logo} alt="logo" className="w-[20vw] md:w-[7vw]" />
        <nav className="ml-auto">
          <ul className="hidden md:flex space-x-7">
            <li><Link to="/home" className="block hover:text-gray-200 transition duration-300">Home</Link></li>
            <li><Link to="/registerdailyborrower" className="block hover:text-gray-200 transition duration-300">Daily Borrower</Link></li>
            <li><Link to="/registermonthlyborrower" className="block hover:text-gray-200 transition duration-300">Monthly Borrower</Link></li>
            <li><Link to="/" className="block text-white hover:text-gray-200 transition duration-300 font-bold">Logout</Link></li>
          </ul>
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </nav>
        <div className={`fixed top-0 right-0 h-full w-64 bg-blue-500 transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
          <div className="p-5">
            <button onClick={() => setIsOpen(false)} className="text-white mb-5">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <ul className="space-y-4">
              <li><Link to="/home" className="block text-white hover:text-gray-200 transition duration-300">Home</Link></li>
              <li><Link to="/registerdailyborrower" className="block text-white hover:text-gray-200 transition duration-300">Daily Borrower</Link></li>
              <li><Link to="/registermonthlyborrower" className="block text-white hover:text-gray-200 transition duration-300">Monthly Borrower</Link></li>
              <li><Link to="/" className="block text-white hover:text-gray-200 transition duration-300 font-bold">Logout</Link></li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header