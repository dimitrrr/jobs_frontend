import { useContext, useEffect } from 'react';
import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header } from './components';
import { Login, Registration } from './pages/authorization';
import { EmployeeHome, EmployeePersonal } from './pages/employee';
import { EmployerHome, EmployerPersonal, VacancyCreator } from './pages/employer';
import { Error } from './pages/Error/Error';
import { BACKEND } from './axios';
import { LOGGENID_ITEM, START_PAGE_URL, TOKEN_ITEM } from './constants';
import { EmployeeProfile, EmployerProfile } from './pages/profile';
import { Vacancy } from './pages/vacancy';
import { AppContext } from './context/context';

function App() {
  const CONTEXT = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const token = window.localStorage.getItem(TOKEN_ITEM);
      if(!token) return;
  
      let updatedContext = {...CONTEXT};
  
      try {
        await BACKEND.post('/userData', { token })
        .then(({data}) => {
          if(data.data === 'token expired') {
            alert('token expired');
            window.localStorage.removeItem(TOKEN_ITEM);
            window.localStorage.removeItem(LOGGENID_ITEM);
            navigate(START_PAGE_URL);
          } else {
            updatedContext = {...updatedContext, user: data.data};

            // try {
            // } 
            // catch(error) {
            //   console.log(error)
            // };
          }
        });
      } catch(error) {
        console.log(error);
      };

      try {
        await BACKEND.post('/postedVacancies', { token })
        .then(({data}) => {
          if(data && data.status === 'ok') {
            updatedContext = {...updatedContext, vacancies: data.data};
          } else {
            console.log('error when loading vacancies', data);
          }
        });
      } catch(error) {
        console.log(error);
      }
  
      CONTEXT.updateState({...CONTEXT, ...updatedContext});
    }

    fetchData();
    
  }, []);

  return (
    <div className='app'>
      <Header />
      <main>
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
          <Route path='/vacancyCreator' element={<VacancyCreator />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
