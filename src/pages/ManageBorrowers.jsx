import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ManageBorrowers = () => {
  const [setuser] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    // Check local storage for user
    const user = localStorage.getItem("user");
    setuser(user)
    if (user !== "admin") {
      navigate("/"); // Navigate to '/' if user is not admin
    }
  }, [navigate]);


  const [borrowers, setBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDaily, setIsDaily] = useState(true); // Toggle between daily and monthly
  const [isFinance, setIsFinance] = useState(false); // Toggle for finance borrowers
  const [selectedBorrower, setSelectedBorrower] = useState(null); // State for selected borrower
  const [editName, setEditName] = useState("");
  const [editContact, setEditContact] = useState("");
  const [editAddress, setEditAddress] = useState("");

  useEffect(() => {
    const fetchBorrowers = async () => {
      try {
        const endpoint = isDaily
          ? "/fetch/fetchdailyborrower"
          : isFinance
            ? "/fetch/fetchfinanceborrower"
            : "/fetch/fetchmonthlyborrower";
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}${endpoint}`
        );
        setBorrowers(
          response.data.dailyBorrowers ||
          response.data.monthlyBorrowers ||
          response.data.financeBorrowers ||
          []
        );
        setLoading(false);
      } catch (err) {
        setError("Error fetching borrowers");
        setLoading(false);
      }
    };

    fetchBorrowers();
  }, [isDaily, isFinance, borrowers]);

  const handleEditClick = (borrower) => {
    setSelectedBorrower(borrower);
    setEditName(borrower.name);
    setEditContact(borrower.contact);
    setEditAddress(borrower.address || ""); // Handle potential undefined address
  };

  const handleUpdateBorrower = async () => {
    try {
      const updatedBorrower = {
        ...selectedBorrower,
        name: editName,
        contact: editContact,
        address: editAddress,
      };

      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/updateBorrower/${selectedBorrower._id}`,
        updatedBorrower
      );

      setBorrowers(
        borrowers.map((b) =>
          b._id === selectedBorrower._id ? updatedBorrower : b
        )
      );
      setSelectedBorrower(null); // Close the modal
    } catch (error) {
      console.error("Error updating borrower:", error);
      setError("Error updating borrower");
    }
  };

  const handleDeleteBorrower = async (borrowerId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this borrower?");
    if (confirmDelete) {
      const confirmFinal = window.confirm("This action cannot be undone. Do you really want to proceed?");
      if (confirmFinal) {
        try {
          await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/deleteBorrower/${borrowerId}`);
          setBorrowers(borrowers.filter(borrower => borrower._id !== borrowerId));
        } catch (error) {
          console.error("Error deleting borrower:", error);
          setError("Error deleting borrower");
        }
      }
    }
  };

  const handleBorrowerTypeChange = (type) => {
    if (type === "daily") {
      setIsDaily(true);
      setIsFinance(false); // Reset finance when switching to daily
    } else if (type === "monthly") {
      setIsDaily(false);
      setIsFinance(false); // Reset finance when switching to monthly
    } else if (type === "finance") {
      setIsDaily(false);
      setIsFinance(true);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <>
      {/* <Header/> */}
      <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-20 px-4 sm:px-6 lg:px-8 mt-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-white shadow-lg p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
            {isDaily ? "DAILY BORROWERS" : "MONTHLY BORROWERS"}
          </h2>

          <div className="mb-4">
            <input
              type="text"
              placeholder="Search by name..."
              className="p-2 border rounded w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex mb-4">
            <button
              onClick={() => handleBorrowerTypeChange("daily")}
              className={`mr-2 p-2 rounded ${isDaily ? "bg-blue-600 text-white" : "bg-white text-blue-600"
                }`}
            >
              Daily Borrowers
            </button>
            <button
              onClick={() => handleBorrowerTypeChange("monthly")}
              className={`mr-2 p-2 rounded ${!isDaily && !isFinance
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600"
                }`}
            >
              Monthly Borrowers
            </button>
            <button
              onClick={() => handleBorrowerTypeChange("finance")}
              className={`p-2 rounded ${isFinance ? "bg-blue-600 text-white" : "bg-white text-blue-600"
                }`}
            >
              Finance Borrowers
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* Table headers */}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Start Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aadhar Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cheque Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal Amount</th>
                    {isDaily && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tenure</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Array.isArray(borrowers) &&
                    borrowers
                      .filter(
                        (borrower) =>
                          borrower.name
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()) // Search by name only
                      )
                      .map((borrower) => (
                        <tr
                          key={borrower._id}
                          className="cursor-pointer hover:bg-gray-100"
                          onClick={() => handleEditClick(borrower)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row click
                                handleDeleteBorrower(borrower._id);
                              }}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div
                              className={`w-4 h-4 rounded-full ${borrower.loanStatus === "closed"
                                  ? "bg-green-500"
                                  : "bg-orange-500"
                                }`}
                            ></div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(borrower.loanStartDate).toLocaleDateString(
                              "en-US",
                              { day: "numeric", month: "long", year: "numeric" }
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {borrower.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {borrower.reference}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {borrower.contact}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {borrower.aadharNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {borrower.chequeNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {borrower.address ? borrower.address : "N/A"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            ₹{borrower.principleAmount}
                          </td>
                          {isDaily && (
                            <td className="px-6 py-4 whitespace-nowrap">
                              ₹{borrower.refundAmount}
                            </td>
                          )}
                          <td className="px-6 py-4 whitespace-nowrap">
                            {borrower.tenure}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Edit Modal */}
          {selectedBorrower && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-8 max-w-md w-full">
                <h2 className="text-2xl font-bold mb-4">Edit Borrower</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Contact
                  </label>
                  <input
                    type="text"
                    value={editContact}
                    onChange={(e) => setEditContact(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="mt-1 p-2 border rounded w-full"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleUpdateBorrower}
                    className="bg-blue-500 text-white p-2 rounded mr-2"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => setSelectedBorrower(null)}
                    className="bg-gray-300 text-gray-700 p-2 rounded"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ManageBorrowers;
