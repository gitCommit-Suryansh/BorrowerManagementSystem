import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaTimes,
  FaPercent,
} from "react-icons/fa";

const DailySchemeBorrower = () => {
  const [dailyBorrowers, setDailyBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [receivedAmounts, setReceivedAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState("");

  // New state variable for today's total collection
  const [todaysTotalCollection, setTodaysTotalCollection] = useState(0);

  // New state variable for search query
  const [searchQuery, setSearchQuery] = useState("");

  // New state variables for profit and loss
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalLoss, setTotalLoss] = useState(0);
  axios.post(`${process.env.REACT_APP_BACKEND_URL}/ping`, {});

  useEffect(() => {
    const fetchDailyBorrowers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/fetch/fetchdailyborrower`
        );
        setDailyBorrowers(response.data.dailyBorrowers);
        setLoading(false);

        // Calculate profit and loss after fetching borrowers
        calculateProfitAndLoss(response.data.dailyBorrowers);

        // Calculate today's total collection after fetching borrowers
        calculateTodaysTotalCollection(response.data.dailyBorrowers);
      } catch (err) {
        setError("Error fetching daily borrowers");
        setLoading(false);
      }
    };

    fetchDailyBorrowers();
  }, [dailyBorrowers]);

  // New function to calculate today's total collection
  const calculateTodaysTotalCollection = (borrowers) => {
    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
    const total = borrowers.reduce((sum, borrower) => {
      return (
        sum +
        (borrower.installments || []).reduce((acc, inst) => {
          // Check if the installment is paid and the paidOn date is today
          if (inst.paid && inst.paidOn && inst.paidOn.split("T")[0] === today) {
            return acc + inst.receivedAmount; // Sum the receivedAmount
          }
          return acc; // Otherwise, return the accumulated value
        }, 0)
      );
    }, 0);
    setTodaysTotalCollection(total); // Set the total collection
  };

  // Call calculateTodaysTotalCollection whenever dailyBorrowers change
  useEffect(() => {
    calculateTodaysTotalCollection(dailyBorrowers);
  }, [dailyBorrowers]);

  // New function to calculate profit and loss
  const calculateProfitAndLoss = (borrowers) => {
    let profit = 0;
    let loss = 0;

    borrowers.forEach((borrower) => {
      if (borrower.balanceAmount > 0) {
        profit += borrower.refundAmount - borrower.principleAmount; // Assuming balanceAmount represents profit
      } else {
        loss += Math.abs(borrower.balanceAmount); // Loss is the absolute value of negative balance
      }
    });

    setTotalProfit(profit);
    setTotalLoss(loss);
  };

  // Calculate total balance amount
  const totalBalanceAmount = dailyBorrowers.reduce(
    (total, borrower) => total + borrower.balanceAmount,
    0
  );
  const totalActiveBorrowers = dailyBorrowers.filter(
    (borrower) => borrower.loanStatus === "pending"
  ).length;
  const totalClosedAccounts = dailyBorrowers.filter(
    (borrower) => borrower.loanStatus === "closed"
  ).length;

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${d.getFullYear()}`;
  };

  const generateInstallments = (borrower, paidInstallments) => {
    const installments = [];
    const startDate = new Date(borrower.loanStartDate);
    const endDate = new Date(borrower.loanEndDate);
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const formattedDate = formatDate(currentDate);
      const paidInstallment = paidInstallments.find((inst) => {
        const paidDate = formatDate(inst.date);
        return paidDate === formattedDate;
      });

      installments.push({
        date: new Date(currentDate),
        demandedAmount: borrower.emiAmount,
        receivedAmount: paidInstallment ? paidInstallment.receivedAmount : 0,
        paid: paidInstallment ? paidInstallment.paid : false,
        paidOn: paidInstallment ? paidInstallment.paidOn : null, // Include paidOn date
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return installments;
  };

  const fetchInstallments = async (borrowerId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/installment/fetchdailyinstallment`,
        {
          params: { borrowerId },
        }
      );
      return response.data.installments;
    } catch (error) {
      console.error("Error fetching installments:", error);
      return [];
    }
  };

  const handleBorrowerSelect = async (borrower) => {
    setSelectedBorrower(borrower);
    const paidInstallments = await fetchInstallments(borrower._id);
    const generatedInstallments = generateInstallments(
      borrower,
      paidInstallments
    );
    setInstallments(generatedInstallments);
    setIsModalOpen(true);
  };

  const handleReceivedAmountChange = (date, amount) => {
    setReceivedAmounts((prev) => ({
      ...prev,
      [date]: amount,
    }));
  };

  const handleSubmitPayment = async (installment) => {
    const receivedAmount = parseFloat(
      receivedAmounts[formatDate(installment.date)] || 0
    );

    const updatedInstallment = {
      date: installment.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      demandedAmount: installment.demandedAmount,
      receivedAmount: receivedAmount,
      paid: true, // Set paid to true by default
      paidOn: receivedAmount > 0 ? new Date().toISOString() : null, // Set paidOn to today's date
    };

    // Update the installments state immediately
    setInstallments((prev) =>
      prev.map((inst) =>
        inst.date.getTime() === installment.date.getTime()
          ? {
              ...inst,
              receivedAmount,
              paid: updatedInstallment.paid,
              paidOn: updatedInstallment.paidOn, // Update the paidOn date
            }
          : inst
      )
    );

    // Clear the received amount for that date
    setReceivedAmounts((prev) => {
      const { [formatDate(installment.date)]: _, ...rest } = prev;
      return rest;
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/installment/adddailyinstallment`,
        {
          borrowerId: selectedBorrower._id,
          installment: updatedInstallment,
        }
      );
      if (response.status === 200) {
        console.log("Installment added successfully");
      } else {
        console.log("Error adding installment");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  const handleDiscountSubmit = async () => {
    if (!discountAmount || isNaN(discountAmount)) {
      alert("Please enter a valid discount amount");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/installment/adddailyborrowerdiscount`,
        {
          borrowerId: selectedBorrower._id,
          discountAmount: parseFloat(discountAmount),
        }
      );

      if (response.status === 200) {
        alert("Discount applied successfully");
      } else {
        alert("Error applying discount");
      }
    } catch (error) {
      console.error("Error submitting discount:", error);
      alert("Error applying discount");
    }
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
        <h2 className="text-3xl font-bold text-white shadow-lg p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500">
          DAILY SCHEME LOANS
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

        {/* Display Today's Total Collection */}

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <div className="p-4 flex flex-wrap justify-between">
              <div>
                <h4 className="text-md font-semibold">
                  <span> Today's Total Collection: ₹{todaysTotalCollection}</span>
                </h4>
                <h4 className="text-md font-semibold">
                  <span> Total Profit: ₹{totalProfit}</span>
                </h4>
              </div>
              <div>
                <h3 className="text-md font-semibold">
                  <span> Total Balance Amount: ₹{totalBalanceAmount}</span>
                </h3>
                <div className="flex flex-col">
                  <h4 className="text-md font-semibold flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-orange-500 inline-block"></span>
                    <span> Total Active Accounts: {totalActiveBorrowers} </span>
                  </h4>
                  <h4 className="text-md font-semibold flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-green-500 inline-block"></span>
                    <span> Total Closed Accounts: {totalClosedAccounts} </span>
                  </h4>
                </div>
              </div>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principle Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refund Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Refunded Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Balance Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    EMI
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyBorrowers
                  .filter((borrower) =>
                    borrower.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                  )
                  .map((borrower) => (
                    <tr
                      key={borrower._id}
                      onClick={() => handleBorrowerSelect(borrower)}
                      className="cursor-pointer hover:bg-gray-100"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            borrower.balanceAmount == 0
                              ? "bg-green-500"
                              : "bg-orange-500"
                          }`}
                        ></div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {borrower.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{borrower.principleAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{borrower.refundAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{borrower.refundedAmount}
                        {borrower.discount > 0 && (
                          <>
                            <span className="text-green-500">*</span>
                            <span className="text-xs text-gray-500">
                              (-₹{borrower.discount})
                            </span>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{borrower.balanceAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(borrower.loanStartDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {formatDate(borrower.loanEndDate)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ₹{borrower.emiAmount}
                      </td>
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
                  onClick={() => setIsModalOpen(false)}
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
              <div className="mb-4 flex items-center">
                <input
                  type="number"
                  className="mr-2 p-2 border rounded"
                  placeholder="Discount amount"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                />
                <button
                  className="bg-green-500 text-white p-2 rounded flex items-center hover:bg-green-600 transition-colors"
                  onClick={handleDiscountSubmit}
                >
                  <FaPercent className="mr-2" /> Apply Discount
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {installments.map((installment, index) => (
                  <div
                    key={index}
                    className="border p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-100"
                  >
                    <div className="flex items-center justify-center mb-2">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      <div className="text-lg font-semibold">
                        {new Date(installment.date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <div className="text-center text-gray-600">
                      EMI: ₹{installment.demandedAmount}
                    </div>
                    <div
                      className={`text-center font-bold mt-2 ${
                        installment.paid ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {installment.paid ? "Paid" : "Pending"}
                    </div>
                    {installment.paid && (
                      <>
                        <div className="mt-2 text-center text-green-600">
                          Paid: ₹{installment.receivedAmount}
                        </div>
                        {installment.paidOn && (
                          <div className="mt-1 text-center text-gray-500">
                            Paid on:{" "}
                            {new Date(installment.paidOn).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
                        )}
                      </>
                    )}
                    {!installment.paid && (
                      <>
                        <input
                          type="number"
                          className="mt-2 w-full p-2 border rounded"
                          placeholder="Received amount"
                          value={
                            receivedAmounts[formatDate(installment.date)] || ""
                          }
                          onChange={(e) =>
                            handleReceivedAmountChange(
                              formatDate(installment.date),
                              e.target.value
                            )
                          }
                        />
                        <button
                          className="mt-2 bg-blue-500 text-white p-2 rounded w-full hover:bg-blue-600 transition-colors"
                          onClick={() => handleSubmitPayment(installment)}
                        >
                          Submit Payment
                        </button>
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
  );
};

export default DailySchemeBorrower;
