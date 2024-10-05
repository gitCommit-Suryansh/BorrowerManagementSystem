import React from 'react'

const Header = () => {
  return (
    <header className="bg-gray-800 text-white py-4 px-8">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">Logo</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="/" className="hover:text-gray-300">Home</a></li>
            <li><a href="/about" className="hover:text-gray-300">About</a></li>
            <li><a href="/contact" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header