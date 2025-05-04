import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUser,
  FaPhone,
  FaIdCard,
  FaMoneyCheckAlt,
  FaCoins,
  FaCalendarAlt,
} from "react-icons/fa";
import axios from "axios";
import Header from "../features/navigation/Header";

const RegisterMonthlyBorrower = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [registeredBorrowers, setRegisteredBorrowers] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    aadharNumber: "",
    chequeNumber: "",
    principleAmount: "",
    interestPercentage: "",
    interestAmount: "",
    loanScheme: "monthly",
    tenure: "",
    loanStartDate: new Date().toISOString().split("T")[0], // Set default to today's date
    loanEndDate: "",
    balanceAmount: "",
    address: "", // Added address field
    reference: "", // Added reference field
  });

  useEffect(() => {
    const fetchRegisteredBorrowers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/fetch/fetchmonthlyborrower`);
        setRegisteredBorrowers(response.data.monthlyBorrowers);
      } catch (error) {
        console.error("Error fetching registered borrowers:", error);
      }
    };

    fetchRegisteredBorrowers();
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === 'name' && value) {
      const filtered = registeredBorrowers.filter(borrower =>
        borrower.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredNames(filtered);
    } else {
      setFilteredNames([]);
    }
  };

  const handleNameSelect = (selectedName) => {
    setFormData({
      ...formData,
      name: selectedName.name,
      contact: selectedName.contact,
      aadharNumber: selectedName.aadharNumber,
      chequeNumber: selectedName.chequeNumber,
      address: selectedName.address,
      reference: selectedName.reference,
    });
    setFilteredNames([]);
  };

  useEffect(() => {
    if (formData.principleAmount && formData.interestPercentage) {
      const principle = parseFloat(formData.principleAmount);
      const interestRate = parseFloat(formData.interestPercentage);
      if (!isNaN(principle) && !isNaN(interestRate)) {
        const interestAmount = (principle * interestRate) / 100;
        setFormData((prevState) => ({
          ...prevState,
          interestAmount: Math.round(interestAmount),
          balanceAmount: Math.round(principle),
        }));
      }
    }
  }, [formData.principleAmount, formData.interestPercentage]);

  useEffect(() => {
    if (formData.loanStartDate && formData.tenure) {
      const startDate = new Date(formData.loanStartDate);
      const tenure = parseInt(formData.tenure);
      if (!isNaN(tenure) && tenure > 0) {
        const endDate = new Date(
          startDate.setMonth(startDate.getMonth() + tenure)
        );
        setFormData((prevState) => ({
          ...prevState,
          loanEndDate: endDate.toISOString().split("T")[0],
        }));
      }
    }
  }, [formData.loanStartDate, formData.tenure]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/auth/registermonthlyborrower`,
        formData
      );
      if (response.status === 200) {
        alert("Monthly Borrower registered successfully");
        setMessage("Monthly Borrower registered successfully");
      } else {
        alert("Failed to register monthly borrower");
        setMessage("Failed to register monthly borrower");
      }
    } catch (error) {
      alert("Error registering monthly borrower:", error);
      setMessage("Error registering monthly borrower:", error);
    }
  };

  return (
   <>
   {/* <Header/> */}
   <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 py-20 px-4 sm:px-6 lg:px-8 mt-12">
      {message && (
        <div className="fixed top-[10%] left-0 right-0 flex justify-center mb-4">
          <p className="bg-green-300 border-l-4 border-green-500 text-red-500 p-4 font-bold rounded-lg">
            {message}
          </p>
        </div>
      )}
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
          Register Monthly Borrower
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaUser className="mr-2" /> Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
                value={formData.name}
              />
              {filteredNames.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-y-auto">
                  {filteredNames.map((borrower) => (
                    <li
                      key={borrower.aadharNumber}
                      className="py-2 px-4 hover:bg-gray-200 cursor-pointer"
                      onClick={() => handleNameSelect(borrower)}
                    >
                      {borrower.name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div>
              <label
                htmlFor="contact"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaPhone className="mr-2" /> Contact
              </label>
              <input
                type="tel"
                id="contact"
                name="contact"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
                value={formData.contact}
              />
            </div>
            <div>
              <label
                htmlFor="aadharNumber"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaIdCard className="mr-2" /> Aadhar Number
              </label>
              <input
                type="text"
                id="aadharNumber"
                name="aadharNumber"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
                value={formData.aadharNumber}
              />
            </div>
            <div>
              <label
                htmlFor="chequeNumber"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaMoneyCheckAlt className="mr-2" /> Cheque Number
              </label>
              <input
                type="text"
                id="chequeNumber"
                name="chequeNumber"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
                value={formData.chequeNumber}
              />
            </div>
            <div>
              <label
                htmlFor="principleAmount"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaCoins className="mr-2" /> Principle Amount
              </label>
              <input
                type="number"
                id="principleAmount"
                name="principleAmount"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="interestPercentage"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaCoins className="mr-2" /> Interest Percentage
              </label>
              <input
                type="number"
                id="interestPercentage"
                name="interestPercentage"
                step="0.01"
                min="0"
                max="100"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="interestAmount"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaCoins className="mr-2" /> Interest Amount
              </label>
              <input
                type="number"
                id="interestAmount"
                name="interestAmount"
                value={formData.interestAmount}
                readOnly
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="tenure"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaCalendarAlt className="mr-2" /> Tenure (in Months)
              </label>
              <input
                type="number"
                id="tenure"
                name="tenure"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="loanStartDate"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaCalendarAlt className="mr-2" /> Loan Start Date
              </label>
              <input
                type="date"
                id="loanStartDate"
                name="loanStartDate"
                value={formData.loanStartDate}
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
              />
            </div>
            <div>
              <label
                htmlFor="loanEndDate"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaCalendarAlt className="mr-2" /> Loan End Date
              </label>
              <input
                type="date"
                id="loanEndDate"
                name="loanEndDate"
                value={formData.loanEndDate}
                readOnly
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="balanceAmount"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaCoins className="mr-2" /> Balance Amount
              </label>
              <input
                type="number"
                id="balanceAmount"
                name="balanceAmount"
                value={formData.balanceAmount}
                readOnly
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-gray-100"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaIdCard className="mr-2" /> Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
                value={formData.address}
              />
            </div>
            <div>
              <label
                htmlFor="reference"
                className="block text-sm font-medium text-gray-700 mb-1 flex items-center"
              >
                <FaIdCard className="mr-2" /> Reference
              </label>
              <input
                type="text"
                id="reference"
                name="reference"
                required
                className="block w-full border border-gray-300 rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                onChange={handleChange}
                value={formData.reference}
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-300"
            >
              Register Monthly Borrower
            </button>
          </div>
        </form>
      </div>
    </div>
   </>
  );
};

export default RegisterMonthlyBorrower;
