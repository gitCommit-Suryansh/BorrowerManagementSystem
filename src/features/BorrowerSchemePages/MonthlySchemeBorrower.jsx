import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaIdCard, FaMoneyCheckAlt, FaCalendarAlt } from 'react-icons/fa';

const MonthlySchemeBorrower = () => {
  const [monthlyBorrowers, setMonthlyBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMonthlyBorrowers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fetch/fetchmonthlyborrower`);
        setMonthlyBorrowers(response.data.monthlyBorrowers);
        setLoading(false);
      } catch (err) {
        setError('Error fetching monthly borrowers');
        setLoading(false);
      }
    };

    fetchMonthlyBorrowers();
  }, []);

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-20 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principle Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyBorrowers.map((borrower) => (
                <tr key={borrower._id}>
                  <td className="px-6 py-4 whitespace-nowrap">{borrower.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{borrower.principleAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{borrower.balanceAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(borrower.loanStartDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(borrower.loanEndDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{borrower.interestAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MonthlySchemeBorrower;
