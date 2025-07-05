import React, { useState, useEffect } from "react";
import axios from "axios";

const MaturityLookup = () => {
  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDaily, setIsDaily] = useState(true);
  const [customDays, setCustomDays] = useState(5);

  const fetchBorrowers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fetch/fetchdailyborrower`);
      const pendingBorrowers = response.data.dailyBorrowers.filter(borrower => borrower.loanStatus === "pending");
      
      // Filter by loan end date within customDays
      const today = new Date();
      const customDaysFromNow = new Date(today);
      customDaysFromNow.setDate(today.getDate() + customDays);

      const filteredBorrowers = pendingBorrowers.filter(borrower => {
        const loanEndDate = new Date(borrower.loanEndDate);
        return loanEndDate <= customDaysFromNow;
      });

      setBorrowers(filteredBorrowers);
      setLoading(false);
    } catch (error) {
      setError("Error fetching borrowers");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowers();
  }, [isDaily]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCustomDaysChange = (e) => {
    setCustomDays(Number(e.target.value));
  };

  const handleFetchBorrowers = () => {
    fetchBorrowers();
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-20 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-white shadow-lg p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
          Daily Scheme Loans Maturity
        </h2>

        <div className="mb-4">
          <label className="mr-2 text-white">Custom Days:</label>
          <input
            type="number"
            value={customDays}
            onChange={handleCustomDaysChange}
            className="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            min="1"
          />
        </div>

        <button onClick={handleFetchBorrowers} className="bg-white text-blue-500 border border-blue-500 p-2 rounded hover:bg-blue-500 hover:text-white transition-colors mb-4 ml-2">
          Reload Borrowers
        </button>

        {/* Display filtered accounts */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refunded Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Difference</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {borrowers.sort((a, b) => new Date(b.loanEndDate) - new Date(a.loanEndDate)).map(borrower => {
                  const loanEndDate = new Date(borrower.loanEndDate);
                  const today = new Date();
                  const difference = Math.floor((loanEndDate - today) / (1000 * 60 * 60 * 24));
                  return (
                    <tr key={borrower._id}  className="cursor-pointer hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-4 h-4 rounded-full ${borrower.balanceAmount === 0 ? "bg-green-500" : "bg-orange-500"}`}></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{borrower.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.principleAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.refundAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.refundedAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.balanceAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(borrower.loanStartDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(borrower.loanEndDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.emiAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap" style={{ color: difference < 0 ? 'red' :  'green' }}>
                        {difference} days
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaturityLookup;
