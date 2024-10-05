import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import Header from './features/navigation/Header'
import Login from './features/auth/Login'
import Home from './pages/Home'
import RegisterBorrower from './pages/Registerborrower'
function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/registerborrower" element={<RegisterBorrower />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
