import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaIdCard, FaMoneyCheckAlt, FaCalendarAlt, FaTimes } from 'react-icons/fa';

const MonthlySchemeBorrower = () => {
  const [monthlyBorrowers, setMonthlyBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [receivedAmounts, setReceivedAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const generateInstallments = (borrower, paidInstallments) => {
    const installments = [];
    const startDate = new Date(borrower.loanStartDate);
    const endDate = new Date(borrower.loanEndDate);
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const formattedDate = currentDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
      const paidInstallment = paidInstallments.find(inst => {
        const paidDate = inst.date.split("T")[0]; // Extract only the date part
        console.log(`Comparing generated date: ${formattedDate} with paid date: ${paidDate}`);
        return formattedDate === paidDate;
      });

      installments.push({
        date: new Date(currentDate),
        demandedAmount: borrower.interestAmount,
        receivedAmount: paidInstallment ? paidInstallment.amount : 0, // Set receivedAmount to the amount from the fetched installment if paid
        paid: !!paidInstallment, // Set paid status based on whether a matching installment was found
      });

      currentDate.setMonth(currentDate.getMonth() + 1); // Move to the next month
    }

    return installments;
  };

  const fetchInstallments = async (borrowerId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/installment/fetchmonthlyinstallment`, {
        params: { borrowerId },
      });
      return response.data.installments;
    } catch (error) {
      console.error("Error fetching installments:", error);
      return [];
    }
  };

  const handleBorrowerSelect = async (borrower) => {
    setSelectedBorrower(borrower);
    const paidInstallments = await fetchInstallments(borrower._id);
    const generatedInstallments = generateInstallments(borrower, paidInstallments);
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
    const receivedAmount = parseFloat(receivedAmounts[installment.date.toISOString().split("T")[0]] || 0);

    // Create updatedInstallment with only the required keys
    const updatedInstallment = {
      date: installment.date.toISOString().split("T")[0], // Format as YYYY-MM-DD
      amount: selectedBorrower.interestAmount, // Set amount to borrower's interestAmount
      paid: receivedAmount >= selectedBorrower.interestAmount, // Determine if paid based on received amount
    };

    setInstallments((prev) =>
      prev.map((inst) =>
        inst.date.getTime() === installment.date.getTime()
          ? {
              ...inst,
              receivedAmount,
              paid: updatedInstallment.paid,
            }
          : inst
      )
    );

    setReceivedAmounts((prev) => {
      const { [installment.date.toISOString().split("T")[0]]: _, ...rest } = prev;
      return rest;
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/installment/addmonthlyinstallment`, {
        borrowerId: selectedBorrower._id,
        installment: updatedInstallment,
      });
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
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/installment/principlerepayment`, {
        borrowerId: selectedBorrower._id,
      });
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

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-20 px-4 sm:px-6 lg:px-8 mt-12">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principle Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyBorrowers.map((borrower) => (
                <tr key={borrower._id} onClick={() => handleBorrowerSelect(borrower)} className="cursor-pointer hover:bg-gray-100">
                  <td className="px-6 py-4 whitespace-nowrap">{borrower.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{borrower.principleAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{borrower.balanceAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(borrower.loanStartDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(borrower.loanEndDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && selectedBorrower && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Installments for {selectedBorrower.name}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
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
                    <div className="text-center text-gray-600">
                      EMI: ₹{installment.demandedAmount}
                    </div>
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
                      <div className="mt-2 text-center text-green-600">
                        Paid: ₹{installment.receivedAmount}
                      </div>
                    )}
                  </div>
                ))}

                {/* New Card for Principal Repayment */}
                <div className=" w-[50%] border p-4 rounded-lg shadow-md bg-gradient-to-br from-white to-gray-100 mt-4 col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
                  <h3 className="text-lg font-semibold text-center">Principal Amount Repayment</h3>
                  <p className="text-center mt-2">Have you paid the principal amount?</p>
                  <button
                    className="mt-4 bg-green-500 text-white p-2 rounded w-full hover:bg-green-600 transition-colors"
                    onClick={handlePrincipalRepayment}
                  >
                    Submit Principal Repayment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonthlySchemeBorrower;