import React from 'react'
import { Link } from 'react-router-dom'

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-8 shadow-lg fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold">LoanManager</h1>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/home" className="hover:text-gray-200 transition duration-300">Home</Link></li>
            <li><Link to="/registerdailyborrower" className="hover:text-gray-200 transition duration-300">Daily Borrower</Link></li>
            <li><Link to="/registermonthlyborrower" className="hover:text-gray-200 transition duration-300">Monthly Borrower</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header