import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './features/navigation/Header'
import Login from './features/auth/Login'
import Home from './pages/Home'
import RegisterDailyBorrower from './pages/RegisterDailyBorrower'
import RegisterMonthlyBorrower from './pages/RegisterMonthlyBorrower'
import DailySchemeBorrower from './features/BorrowerSchemePages/DailySchemeBorrower'
import MonthlySchemeBorrower from './features/BorrowerSchemePages/MonthlySchemeBorrower'
import ModifyBorrowers from './features/ModifyPage/ModifyBorrowers';
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/registerdailyborrower" element={<RegisterDailyBorrower />} />
          <Route path="/registermonthlyborrower" element={<RegisterMonthlyBorrower />} />
          <Route path="/dailyborrower" element={<DailySchemeBorrower />} />
          <Route path="/monthlyborrower" element={<MonthlySchemeBorrower />} />
          <Route path="/modifyborrowers" element={<ModifyBorrowers/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
