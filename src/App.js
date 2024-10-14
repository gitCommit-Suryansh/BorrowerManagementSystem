import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

import Header from './features/navigation/Header'
import Login from './features/auth/Login'
import Home from './pages/Home'
import RegisterDailyBorrower from './pages/RegisterDailyBorrower'
import RegisterMonthlyBorrower from './pages/RegisterMonthlyBorrower'
import RegisterFinanceBorrower from './pages/RegisterFinanceBorrower';
import DailySchemeBorrower from './features/BorrowerSchemePages/DailySchemeBorrower'
import MonthlySchemeBorrower from './features/BorrowerSchemePages/MonthlySchemeBorrower'
import FinanceSchemeBorrower from './features/BorrowerSchemePages/FinanceSchemeBorrower'
import ModifyBorrowers from './features/ModifyPage/ModifyBorrowers';
import ManageBorrowers from './pages/ManageBorrowers';

function App() {
  const location = useLocation(); // Get the current location

  return (
    <div className="App">
      {/* Conditionally render Header based on the current route */}
      {location.pathname !== '/' && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/onlyadmin" element={<ManageBorrowers />} />
        <Route path="/registerdailyborrower" element={<RegisterDailyBorrower />} />
        <Route path="/registermonthlyborrower" element={<RegisterMonthlyBorrower />} />
        <Route path="/registerfinanceborrower" element={<RegisterFinanceBorrower />} />
        <Route path="/dailyborrower" element={<DailySchemeBorrower />} />
        <Route path="/monthlyborrower" element={<MonthlySchemeBorrower />} />
        <Route path="/financeborrower" element={<FinanceSchemeBorrower />} />
        <Route path="/modifyborrowers" element={<ModifyBorrowers />} />
      </Routes>
    </div>
  );
}

// Wrap App with Router
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
