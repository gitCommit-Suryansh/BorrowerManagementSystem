import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPhone, FaIdCard, FaMoneyCheckAlt, FaCoins, FaCalendarAlt, FaClipboardList } from 'react-icons/fa';

const RegisterBorrower = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    aadharNumber: '',
    chequeNumber: '',
    principleAmount: '',
    refundAmount: '',
    tenure: '',
    loanScheme: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement API call to save borrower details
    console.log('Borrower details:', formData);
    // Navigate to home page after successful registration
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Register Borrower</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaUser className="mr-2" /> Name
              </label>
              <input type="text" id="name" name="name" required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaPhone className="mr-2" /> Contact
              </label>
              <input type="tel" id="contact" name="contact" required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="aadharNumber" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaIdCard className="mr-2" /> Aadhar Number
              </label>
              <input type="text" id="aadharNumber" name="aadharNumber" required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="chequeNumber" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaMoneyCheckAlt className="mr-2" /> Cheque Number
              </label>
              <input type="text" id="chequeNumber" name="chequeNumber" required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="principleAmount" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaCoins className="mr-2" /> Principle Amount
              </label>
              <input type="number" id="principleAmount" name="principleAmount" required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="refundAmount" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaCoins className="mr-2" /> Refund Amount
              </label>
              <input type="number" id="refundAmount" name="refundAmount" required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="tenure" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaCalendarAlt className="mr-2" /> Tenure (in Days)
              </label>
              <input type="number" id="tenure" name="tenure" required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="loanScheme" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                <FaClipboardList className="mr-2" /> Loan Scheme
              </label>
              <select id="loanScheme" name="loanScheme" required className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" onChange={handleChange}>
                <option value="">Select a scheme</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <div className="mt-8">
            <button type="submit" className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300">
              Register Borrower
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterBorrower;
