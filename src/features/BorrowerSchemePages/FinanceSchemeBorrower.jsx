import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaPhone, FaIdCard, FaMoneyCheckAlt, FaCoins, FaCalendarAlt, FaTimes } from "react-icons/fa";
import Header from "../navigation/Header";

const FinanceSchemeBorrower = () => {
  const [financeBorrowers, setFinanceBorrowers] = useState([]);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [receivedAmounts, setReceivedAmounts] = useState({});
  const [discountAmount, setDiscountAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [todaysTotalCollection, setTodaysTotalCollection] = useState(0); // New state for today's total collection

  useEffect(() => {
    const fetchFinanceBorrowers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fetch/fetchfinanceborrower`);
        setFinanceBorrowers(response.data.financeBorrowers); // Ensure this is an array
      } catch (err) {
        setError("Error fetching finance borrowers");
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceBorrowers();
  }, [financeBorrowers]);

  const handleBorrowerSelect = async (borrower) => {
    setSelectedBorrower(borrower);
    const paidInstallments = await fetchInstallments(borrower._id);
    const generatedInstallments = generateInstallments(borrower, paidInstallments);
    setInstallments(generatedInstallments);
    setIsModalOpen(true);
  };

  const fetchInstallments = async (borrowerId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/installment/fetchfinanceinstallment`, {
        params: { borrowerId },
      });
      return response.data.installments;
    } catch (error) {
      console.error("Error fetching installments:", error);
      return [];
    }
  };

  const generateInstallments = (borrower, paidInstallments) => {
    const installments = [];
    const startDate = new Date(borrower.loanStartDate);
    const endDate = new Date(borrower.loanEndDate);
    
    // Set currentDate to the month after the loan start date
    let currentDate = new Date(startDate);
    currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month

    while (currentDate <= endDate) {
        const paidInstallment = paidInstallments.find((inst) => {
            return new Date(inst.date).toDateString() === currentDate.toDateString();
        });

        const installmentDetail = {
            date: new Date(currentDate),
            demandedAmount: borrower.emiAmount,
            receivedAmount: paidInstallment ? paidInstallment.amount : 0,
            paid: paidInstallment ? paidInstallment.paid : false,
            paidOn: paidInstallment ? paidInstallment.paidOn : null,
        };

        installments.push(installmentDetail);

        currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
    }

    return installments;
  };

  const handleReceivedAmountChange = (date, amount) => {
    setReceivedAmounts((prev) => ({
      ...prev,
      [date]: amount,
    }));
  };

  const handleSubmitPayment = async (installment) => {
    const receivedAmount = parseFloat(receivedAmounts[installment.date.toISOString().split("T")[0]] || 0);
    const updatedInstallment = {
      date: installment.date.toISOString().split("T")[0],
      amount: receivedAmount,
      paid: receivedAmount > 0,
      paidOn: receivedAmount > 0 ? new Date().toISOString() : null,
    };

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/installment/addfinanceinstallment`, {
        borrowerId: selectedBorrower._id,
        installment: updatedInstallment,
      });

      if (response.status === 200) {
        // Update the local state to reflect the change immediately
        setInstallments((prev) =>
          prev.map((inst) =>
            inst.date.toISOString().split("T")[0] === updatedInstallment.date
              ? { ...inst, receivedAmount, paid: true, paidOn: updatedInstallment.paidOn }
              : inst
          )
        );
        console.log("Installment added successfully");
      } else {
        console.log("Error adding installment");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  // New function to calculate today's total collection
  const calculateTodaysTotalCollection = (borrowers) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const total = borrowers.reduce((sum, borrower) => {
      return (
        sum +
        (borrower.installments || []).reduce((acc, inst) => {
          // Check if the installment is paid and the paidOn date is today
          if (inst.paid && inst.paidOn && inst.paidOn.split("T")[0] === today) {
            return acc + inst.amount; // Sum the receivedAmount
          }
          return acc; // Otherwise, return the accumulated value
        }, 0)
      );
    }, 0);
    setTodaysTotalCollection(total); // Set the total collection
  };

  // Call calculateTodaysTotalCollection whenever financeBorrowers change
  useEffect(() => {
    calculateTodaysTotalCollection(financeBorrowers);
  }, [financeBorrowers]);

  const totalBalanceAmount = financeBorrowers.reduce(
    (total, borrower) => total + borrower.balanceAmount,
    0
  );
  const totalActiveBorrowers = financeBorrowers.filter(
    (borrower) => borrower.loanStatus === "pending"
  ).length;
  const totalClosedAccounts = financeBorrowers.filter(
    (borrower) => borrower.loanStatus === "closed"
  ).length;

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
          FINANCE SCHEME LOANS
        </h2>

        {/* New Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name..."
            className="p-2 border rounded w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* New Summary Section */}
        

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
        <div className="p-4 flex flex-wrap justify-between mb-4">
          <div>
            <h4 className="text-md font-semibold">
              <span>Today's Total Collection: ₹{todaysTotalCollection}</span>
            </h4>
          </div>
          <div>
            <h3 className="text-md font-semibold">
              <span>Total Balance Amount: ₹{totalBalanceAmount}</span>
            </h3>
            <div className="flex flex-col">
              <h4 className="text-md font-semibold flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-orange-500 inline-block"></span>
                <span>Total Active Accounts: {totalActiveBorrowers}</span>
              </h4>
              <h4 className="text-md font-semibold flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
                <span>Total Closed Accounts: {totalClosedAccounts}</span>
              </h4>
            </div>
          </div>
        </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principle Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refunded Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Array.isArray(financeBorrowers) && financeBorrowers
                  .filter((borrower) =>
                    borrower.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((borrower) => (
                    <tr key={borrower._id} onClick={() => handleBorrowerSelect(borrower)} className="cursor-pointer hover:bg-gray-100">
                      <td className="px-6 py-4 whitespace-nowrap"><div
                            className={`w-4 h-4 rounded-full ${
                              borrower.loanStatus == 'closed'
                                ? "bg-green-500"
                                : "bg-orange-500"
                            }`}
                          ></div></td>
                      <td className="px-6 py-4 whitespace-nowrap">{borrower.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.principleAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.refundAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.refundedAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.balanceAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(borrower.loanStartDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{new Date(borrower.loanEndDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">₹{borrower.emiAmount}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && selectedBorrower && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">
                  Installments for {selectedBorrower.name}
                </h2>
                <button
                  onClick={() => setIsModalOpen(false)} // Close modal function
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes size={24} />
                </button>
              </div>
              <div className="mb-4 text-lg font-semibold text-green-600">
                {installments.filter((inst) => inst.paid).length}{" "}
                {installments.filter((inst) => inst.paid).length === 1
                  ? "Installment"
                  : "Installments"}{" "}
                paid
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {installments.map((installment, index) => (
                  <div key={index} className="border p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-100">
                    <div className="flex items-center justify-center mb-2">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      <div className="text-lg font-semibold">
                        {new Date(installment.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="text-center text-gray-600">EMI: ₹{installment.demandedAmount}</div>
                    <div className={`text-center font-bold mt-2 ${installment.paid ? "text-green-500" : "text-red-500"}`}>
                      {installment.paid ? "Paid" : "Pending"}
                    </div>
                    {!installment.paid && (
                      <>
                        <input
                          type="number"
                          className="mt-2 w-full p-2 border rounded"
                          placeholder="Received amount"
                          value={receivedAmounts[installment.date.toISOString().split("T")[0]] || ""}
                          onChange={(e) => handleReceivedAmountChange(installment.date.toISOString().split("T")[0], e.target.value)}
                        />
                        <button
                          className="mt-2 bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition-colors"
                          onClick={() => handleSubmitPayment(installment)}
                        >
                          Submit Payment
                        </button>
                      </>
                    )}
                    {installment.paid && (
                      <>
                        <div className="mt-2 text-center text-green-600">Paid: ₹{installment.receivedAmount}</div>
                        {installment.paidOn && (
                          <div className="mt-1 text-center text-gray-500">
                            Paid on: {new Date(installment.paidOn).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default FinanceSchemeBorrower;