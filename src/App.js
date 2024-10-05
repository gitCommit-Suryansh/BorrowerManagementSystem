import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './features/navigation/Header'
import Login from './features/auth/Login'
import Home from './pages/Home'
import RegisterDailyBorrower from './pages/RegisterDailyBorrower'
import RegisterMonthlyBorrower from './pages/RegisterMonthlyBorrower'
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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
