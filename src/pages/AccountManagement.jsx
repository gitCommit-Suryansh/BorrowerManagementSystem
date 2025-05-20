import React, { useState, useEffect } from "react";
import axios from "axios";

// Utility function to format date to dd/mm/yyyy
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AccountManagement = () => {
  // State variables
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isDaily, setIsDaily] = useState(true);
  const [borrowers, setBorrowers] = useState([]);
  const [filteredBorrowers, setFilteredBorrowers] = useState([]); // State for filtered borrowers
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalProfit, setTotalProfit] = useState(0); // State for total profit

  // Fetch accounts
  const fetchAccounts = async () => {
    try {
      const endpoint = isDaily
        ? "/fetch/fetchdailyborrower"
        : "/fetch/fetchmonthlyborrower";

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}${endpoint}`);
      
      // Filter borrowers to only include those with loanStatus "CLOSED"
      const filteredBorrowers = (isDaily ? response.data.dailyBorrowers : response.data.monthlyBorrowers)
        .filter(borrower => borrower.loanStatus === "closed");
      
      setBorrowers(filteredBorrowers);
      setLoading(false);
    } catch (error) {
      setError("Error fetching borrowers");
      setLoading(false);
    }
  };

  // Call fetchAccounts on component mount
  useEffect(() => {
    fetchAccounts();
  }, [isDaily]);

  // Filter borrowers based on date range and search query
  useEffect(() => {
    const filterBorrowers = () => {
        const filtered = borrowers.filter((borrower) => {
            const loanStartDate = new Date(borrower.loanStartDate);
            const loanEndDate = new Date(borrower.loanEndDate);
            const start = new Date(startDate);
            const end = new Date(endDate);
        
            // Ensure start and end dates are valid before comparing
            const isWithinDateRange =
              (!startDate || isNaN(start.getTime()) || loanStartDate >= start) && 
              (!endDate || isNaN(end.getTime()) || loanEndDate <= end);
            const matchesSearchQuery = borrower.name.toLowerCase().includes(searchQuery.toLowerCase());
        
            return isWithinDateRange && matchesSearchQuery;
          });

      setFilteredBorrowers(filtered);

      // Calculate total profit
      const profit = filtered.reduce((acc, borrower) => {
          return acc + (borrower.refundAmount - borrower.principleAmount);
      }, 0);
      setTotalProfit(profit);
    };

    filterBorrowers();
  }, [borrowers, startDate, endDate, searchQuery]);

  const handleBorrowerTypeChange = (type) => {
    setIsDaily(type === "daily");
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-20 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white shadow-lg p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 mb-4">
            Account Management
          </h2>

          {/* Toggle Button for Daily/Monthly Borrowers */}
          <div className="flex mb-4">
            <button
              onClick={() => handleBorrowerTypeChange("daily")}
              className={`mr-2 p-2 rounded ${isDaily ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
            >
              Daily Borrowers
            </button>
            <button
              onClick={() => handleBorrowerTypeChange("monthly")}
              className={`p-2 rounded ${!isDaily ? "bg-blue-600 text-white" : "bg-white text-blue-600"}`}
            >
              Monthly Borrowers
            </button>
          </div>

          {/* Date Range Inputs */}
          <div className="mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="p-2 border rounded mr-2"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="p-2 border rounded"
            />
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="p-2 border rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Display total profit in a prominent position */}
          <div className="bg-white shadow-md rounded-lg p-4 mb-8">
            <h3 className="text-xl font-bold text-center">Total Profit: ₹{totalProfit}</h3>
          </div>

          {/* Display filtered accounts */}
          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan End Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    {isDaily ? (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refunded Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Amount</th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Percentage</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Interest Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBorrowers.map((borrower) => (
                    <tr key={borrower._id} className="hover:bg-gray-100 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`w-4 h-4 rounded-full ${borrower.loanStatus === "closed" ? "bg-green-500" : "bg-orange-500"}`}></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(borrower.loanStartDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{formatDate(borrower.loanEndDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{borrower.name}</td>
                      {isDaily ? (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.principleAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.refundAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.refundedAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.emiAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{borrower.tenure}</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.discount || 0}</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.balanceAmount}</td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.principleAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{borrower.interestPercentage}%</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.interestAmount}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{borrower.tenure}</td>
                          <td className="px-6 py-4 whitespace-nowrap">₹{borrower.discount || 0}</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AccountManagement;
