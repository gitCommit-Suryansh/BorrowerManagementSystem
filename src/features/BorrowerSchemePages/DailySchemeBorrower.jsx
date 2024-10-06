import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaUser, FaPhone, FaIdCard, FaMoneyCheckAlt, FaCalendarAlt } from 'react-icons/fa';

const DailySchemeBorrower = () => {
  const [dailyBorrowers, setDailyBorrowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBorrower, setSelectedBorrower] = useState(null);
  const [installments, setInstallments] = useState([]);
  const [receivedAmounts, setReceivedAmounts] = useState({});

  useEffect(() => {
    const fetchDailyBorrowers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fetch/fetchdailyborrower`);
        setDailyBorrowers(response.data.dailyBorrowers);
        setLoading(false);
      } catch (err) {
        setError('Error fetching daily borrowers');
        setLoading(false);
      }
    };

    fetchDailyBorrowers();
  }, []);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  const generateInstallments = (borrower, paidInstallments) => {
    const installments = [];
    const startDate = new Date(borrower.loanStartDate);
    const endDate = new Date(borrower.loanEndDate);
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const formattedDate = formatDate(currentDate);
      const paidInstallment = paidInstallments.find(inst => {
        const paidDate = formatDate(inst.date);
        return paidDate === formattedDate;
      });

      installments.push({
        date: new Date(currentDate),
        demandedAmount: borrower.emiAmount,
        receivedAmount: paidInstallment ? paidInstallment.receivedAmount : 0,
        paid: paidInstallment ? paidInstallment.paid : false
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return installments;
  };

  const fetchInstallments = async (borrowerId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/installment/fetchdailyinstallment`, {
        params: { borrowerId }
      });
      return response.data.installments;
    } catch (error) {
      console.error('Error fetching installments:', error);
      return [];
    }
  };

  const handleBorrowerSelect = async (borrower) => {
    setSelectedBorrower(borrower);
    const paidInstallments = await fetchInstallments(borrower._id);
    const generatedInstallments = generateInstallments(borrower, paidInstallments);
    setInstallments(generatedInstallments);
  };

  const handleReceivedAmountChange = (date, amount) => {
    setReceivedAmounts(prev => ({
      ...prev,
      [date]: amount
    }));
  };

  const handleSubmitPayment = async (installment) => {
    const receivedAmount = parseFloat(receivedAmounts[formatDate(installment.date)] || 0);
    
    const updatedInstallment = {
      date: installment.date.toISOString().split('T')[0], // Format as YYYY-MM-DD
      demandedAmount: installment.demandedAmount,
      receivedAmount: receivedAmount,
      paid: receivedAmount >= installment.demandedAmount
    };

    setInstallments(prev => prev.map(inst => 
      inst.date.getTime() === installment.date.getTime() 
        ? {...inst, receivedAmount, paid: receivedAmount >= inst.demandedAmount}
        : inst
    ));

    setReceivedAmounts(prev => {
      const { [formatDate(installment.date)]: _, ...rest } = prev;
      return rest;
    });

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/installment/adddailyinstallment`, {
        borrowerId: selectedBorrower._id,
        installment: updatedInstallment
      });
      if (response.status === 200) {
        console.log('Installment added successfully');
      } else {
        console.log('Error adding installment');
      }
    } catch (error) {
      console.error('Error submitting payment:', error);
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">EMI</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dailyBorrowers.map((borrower) => (
                <tr 
                  key={borrower._id} 
                  onClick={() => handleBorrowerSelect(borrower)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="px-6 py-4 whitespace-nowrap">{borrower.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{borrower.principleAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{borrower.refundAmount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(borrower.loanStartDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatDate(borrower.loanEndDate)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">₹{borrower.emiAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedBorrower && (
          <div className="bg-white shadow-md rounded-lg overflow-hidden p-6 mt-8">
            <h2 className="text-2xl font-bold mb-4">Installments for {selectedBorrower.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {installments.map((installment, index) => (
                <div 
                  key={index} 
                  className="border p-4 rounded text-center"
                >
                  <div className="font-bold">{formatDate(installment.date)}</div>
                  <div>EMI: ₹{installment.demandedAmount}</div>
                  <div className={`text-sm ${installment.paid ? 'text-green-500' : 'text-red-500'}`}>
                    {installment.paid ? 'Paid' : 'Pending'}
                  </div>
                  {!installment.paid && (
                    <>
                      <input 
                        type="number" 
                        className="mt-2 w-full p-2 border rounded"
                        placeholder="Received amount"
                        value={receivedAmounts[formatDate(installment.date)] || ''}
                        onChange={(e) => handleReceivedAmountChange(formatDate(installment.date), e.target.value)}
                      />
                      <button 
                        className="mt-2 bg-blue-500 text-white p-2 rounded w-full"
                        onClick={() => handleSubmitPayment(installment)}
                      >
                        Submit Payment
                      </button>
                    </>
                  )}
                  {installment.paid && (
                    <div className="mt-2">Paid: ₹{installment.receivedAmount}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySchemeBorrower;