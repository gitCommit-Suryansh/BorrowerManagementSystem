import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-white mb-10 text-center">Borrower Management System</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card
            title="Daily Scheme"
            description="Manage daily installments for borrowers"
            link="/daily-scheme"
            icon="📅"
          />
          <Card
            title="Monthly Scheme"
            description="Manage monthly installments for borrowers"
            link="/monthly-scheme"
            icon="📆"
          />
          <Card
            title="Borrower"
            description="Add a new borrower to the system"
            link="/registerdailyborrower"
            link2="/registermonthlyborrower"
            icon="👤"
          />
        </div>
      </div>
    </div>
  );
};

const Card = ({ title, description, link, link2, icon }) => (
  <div className="bg-white rounded-lg shadow-xl overflow-hidden transform transition duration-500 hover:scale-105">
    <div className="p-6">
      <div className="text-4xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <Link
        to={link}
        className="inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 mr-2 mb-2"
      >
        {title === "Borrower" ? "Register Daily Borrower" : `Go to ${title}`}
      </Link>
      {link2 && (
        <Link
          to={link2}
          className="inline-block bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
        >
          Register Monthly Borrower
        </Link>
      )}
    </div>
  </div>
);

export default Home;
