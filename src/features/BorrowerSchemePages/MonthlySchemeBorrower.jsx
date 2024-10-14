import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaMoneyCheckAlt,
  FaCalendarAlt,
  FaTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaPercent,
} from "react-icons/fa";
import Header from "../navigation/Header";

const MonthlySchemeBorrower = () => {
  const [monthlyBorrowers, setMonthlyBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [receivedAmounts, setReceivedAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(""); // New state for discount amount

  // New state variable for today's total collection
  const [todaysTotalCollection, setTodaysTotalCollection] = useState(0);

  // New state variable for search query
  const [searchQuery, setSearchQuery] = useState("");

  // New state variable for total pending amount
  const [totalPendingAmount, setTotalPendingAmount] = useState(0);

  // New state for total paid amount
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);

  axios.post(`${process.env.REACT_APP_BACKEND_URL}/ping`, {});
  useEffect(() => {
    const fetchMonthlyBorrowers = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/fetch/fetchmonthlyborrower`
        );
        setMonthlyBorrowers(response.data.monthlyBorrowers);
        setLoading(false);

        // Calculate today's total collection after fetching borrowers
        calculateTodaysTotalCollection(response.data.monthlyBorrowers);
      } catch (err) {
        setError("Error fetching monthly borrowers");
        setLoading(false);
      }
    };

    fetchMonthlyBorrowers();
  }, [monthlyBorrowers]);

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

  // Call calculateTodaysTotalCollection whenever monthlyBorrowers change
  useEffect(() => {
    calculateTodaysTotalCollection(monthlyBorrowers);
  }, [monthlyBorrowers]);

  const totalBalanceAmount = monthlyBorrowers.reduce(
    (total, borrower) => total + borrower.balanceAmount,
    0
  );
  const totalActiveBorrowers = monthlyBorrowers.filter(
    (borrower) => borrower.loanStatus === "pending"
  ).length;
  const totalClosedAccounts = monthlyBorrowers.filter(
    (borrower) => borrower.loanStatus === "closed"
  ).length;

  const generateInstallments = (borrower, paidInstallments) => {
    console.log(borrower);
    console.log(paidInstallments);
    const installments = [];
    const startDate = new Date(borrower.loanStartDate);
    const endDate = new Date(borrower.loanEndDate);
    let currentDate = new Date(startDate);

    // Move to the next month after the start date
    currentDate.setMonth(currentDate.getMonth() + 1); // Start from the month after the start date

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const paidInstallment = paidInstallments.find((inst) => {
        const paidDate = inst.date.split("T")[0]; // Extract only the date part
        return formattedDate === paidDate;
      });

      installments.push({
        date: new Date(currentDate),
        demandedAmount: borrower.interestAmount,
        receivedAmount: paidInstallment ? paidInstallment.amount : 0, // Set receivedAmount to the amount from the fetched installment if paid
        paid: !!paidInstallment, // Set paid status based on whether a matching installment was found
        paidOn: paidInstallment ? paidInstallment.paidOn : null,
      });

      currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
    }
    return installments;
  };

  const fetchInstallments = async (borrowerId) => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/installment/fetchmonthlyinstallment`,
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

    // New calculation for total pending amount
    const totalPaidAmount = paidInstallments.reduce((sum, inst) => sum + inst.amount, 0);
    const totalDueAmount = paidInstallments.length * borrower.interestAmount; // Total due based on installments
    const totalPendingAmount = Math.max(0, totalDueAmount - totalPaidAmount); // Ensure totalPendingAmount is at least 0
    setTotalPendingAmount(totalPendingAmount); // Set the total pending amount in state
    setTotalPaidAmount(totalPaidAmount); // Set the total paid amount in state
  };

  const handleReceivedAmountChange = (date, amount) => {
    setReceivedAmounts((prev) => ({
      ...prev,
      [date]: amount,
    }));
  };

  const handleSubmitPayment = async (installment) => {
    console.log(installment);
    const receivedAmount = parseFloat(
      receivedAmounts[installment.date.toISOString().split("T")[0]] || 0
    );

    // Create updatedInstallment with only the required keys
    const updatedInstallment = {
      date: installment.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      amount: receivedAmount, // Set amount to the received amount from the input
      paid: receivedAmount > 0, // Determine if paid based on received amount
      paidOn: receivedAmount > 0 ? new Date().toISOString() : null, // Save the current date in the desired format
    };

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

    setReceivedAmounts((prev) => {
      const { [installment.date.toISOString().split("T")[0]]: _, ...rest } =
        prev;
      return rest;
    });

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/installment/addmonthlyinstallment`,
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

  const handlePrincipalRepayment = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/installment/principlerepayment`,
        {
          borrowerId: selectedBorrower._id,
        }
      );
      if (response.status === 200) {
        console.log("Principal repayment recorded successfully");
        alert("Principal repayment recorded successfully");
      } else {
        console.log("Error recording principal repayment");
        alert("Error recording principal repayment");
      }
    } catch (error) {
      console.error("Error recording principal repayment:", error);
      alert("Error recording principal repayment");
    }
  };

  const handleDiscountSubmit = async () => {
    // New function to handle discount submission
    if (!discountAmount || isNaN(discountAmount)) {
      alert("Please enter a valid discount amount");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/installment/addmonthlyborrowerdiscount`,
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

  // New useEffect to recalculate totalPendingAmount whenever installments or selectedBorrower changes
  useEffect(() => {
    if (selectedBorrower) {
      const paidInstallments = installments.filter(inst => inst.paid);
      const totalPaidAmount = paidInstallments.reduce((sum, inst) => sum + inst.receivedAmount, 0);
      const totalDueAmount = paidInstallments.length * selectedBorrower.interestAmount; // Total due based on installments
      const totalPendingAmount = Math.max(0, totalDueAmount - totalPaidAmount); // Ensure totalPendingAmount is at least 0
      setTotalPendingAmount(totalPendingAmount); // Set the total pending amount in state
      setTotalPaidAmount(totalPaidAmount); // Update total paid amount
    }
  }, [installments, selectedBorrower]);

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
          MONTHLY SCHEME LOANS
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

        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <div className="p-4 flex flex-wrap justify-between">
              <div>
                <h4 className="text-md font-semibold">
                  <span> Today's Total Collection: ₹{todaysTotalCollection}</span>
                </h4>
                {/* <h4 className="text-md font-semibold">
                  <span> Total Profit: ₹{totalProfit}</span>
                </h4> */}
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
          </div>
          <div className="overflow-x-auto">
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
                    Balance Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {monthlyBorrowers
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
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            borrower.loanStatus === "pending"
                              ? "bg-orange-500"
                              : "bg-green-500"
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
                        ₹{borrower.balanceAmount}
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
                        ₹{borrower.interestAmount}
                        {borrower.interestPercentage > 0 && (
                          <>
                            <span className="text-green-500">*</span>
                            <span className="text-xs text-gray-500">
                              ({borrower.interestPercentage}%)
                            </span>
                          </>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(borrower.loanStartDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(borrower.loanEndDate).toLocaleDateString()}
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
              {/* New total pending amount display */}
              <h4 className="text-md font-semibold">
                Total Amount Pending: ₹{totalPendingAmount}
              </h4>
              {/* New total paid amount display */}
              <h4 className="text-md font-semibold">
                Total Amount Paid: ₹{totalPaidAmount} {/* Display total paid amount */}
              </h4>
              {/* New discount input section */}
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
              <h3 className="text-lg font-semibold mb-2 text-green-500">
                {selectedBorrower.installments.length}{" "}
                {selectedBorrower.installments.length > 1
                  ? "Installments"
                  : "Installment"}{" "}
                paid {/* Total Count of Installments */}
              </h3>
              <h3 className="text-lg font-semibold mb-2 text-green-500">
                {selectedBorrower.balanceAmount === 0 ? (
                  <span>Principle Amount Paid Back</span>
                ) : (
                  <span className="text-red-500">
                    Principle Amount Not-Paid Yet
                  </span>
                )}
                {/* Total Count of Installments */}
              </h3>
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
                        {/* New message for paid on date */}
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
                        {/* New message for pending amount */}
                        {selectedBorrower.interestAmount >
                          installment.receivedAmount && (
                          <div className="mt-2 text-center text-red-500">
                            ₹
                            {selectedBorrower.interestAmount -
                              installment.receivedAmount}{" "}
                            amount pending
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
                            receivedAmounts[
                              installment.date.toISOString().split("T")[0]
                            ] || ""
                          }
                          onChange={(e) =>
                            handleReceivedAmountChange(
                              installment.date.toISOString().split("T")[0],
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

                {/* New Card for Principal Repayment */}
                {selectedBorrower.balanceAmount !== 0 && (
                  <div className="border p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-100 mt-4 col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                    <h3 className="text-lg font-semibold text-center">
                      Principal Amount Repayment
                    </h3>
                    <p className="text-center mt-2">
                      Have you paid the principal amount?
                    </p>
                    <button
                      className="mt-4 bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 transition-colors"
                      onClick={handlePrincipalRepayment}
                    >
                      Submit Principal Repayment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
   </>
  );
};

export default MonthlySchemeBorrower;