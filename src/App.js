import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from './components';
import { Login, Registration } from './pages/authorization';
import { EmployeeHome, EmployeePersonal, EmployerProfile } from './pages/employee';
import { EmployeeProfile, EmployerHome, EmployerPersonal } from './pages/employer';
import { Error } from './pages/Error/Error';

function App() {
  return (
    <Router>
      <div className='app'>
        <Header />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/employee' element={<EmployeeHome />} />
          <Route path='/employee/personal' element={<EmployeePersonal />} />
          <Route path='/employee/employers/:userId' element={<EmployerProfile />} />
          <Route path='/employer' element={<EmployerHome />} />
          <Route path='/employer/personal' element={<EmployerPersonal />} />
          <Route path='/employer/employees/:userId' element={<EmployeeProfile />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
