import { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Header } from './components';
import { Login, Registration } from './pages/authorization';
import { EmployeeHome, EmployeePersonal } from './pages/employee';
import { EmployerHome, EmployerPersonal } from './pages/employer';
import { Error } from './pages/Error/Error';
import { BACKEND } from './axios';
import { DEFAULT_URL, LOGGENID_ITEM, TOKEN_ITEM } from './constants';
import { EmployeeProfile, EmployerProfile } from './pages/profile';
import { Vacancy } from './pages/vacancy';

function App() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = window.localStorage.getItem(TOKEN_ITEM);
    if(!token) return;

    try {
      BACKEND.post('/userData', { token })
      .then(({data}) => {
        if(data.data === 'token expired') {
          alert('token expired');
          window.localStorage.removeItem(TOKEN_ITEM);
          window.localStorage.removeItem(LOGGENID_ITEM);
          window.location.replace(DEFAULT_URL);
        } else {
          setUserData(data.data);
        }
      });
    } catch(error) {
      console.log(error)
    };
    
  }, []);

  return (
    <Router>
      <div className='app'>
        <Header userData={userData} />
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/employee' element={<EmployeeHome />} />
          <Route path='/employee/personal' element={<EmployeePersonal />} />
          <Route path='/employers' element={<EmployerProfile />} />
          <Route path='/employer' element={<EmployerHome />} />
          <Route path='/employer/personal' element={<EmployerPersonal />} />
          <Route path='/employees' element={<EmployeeProfile />} />
          <Route path='/vacancies' element={<Vacancy />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
