import { useContext, useEffect } from 'react';
import './App.css';
import 'alertifyjs/build/css/alertify.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { Header } from './components';
import { Login, Registration } from './pages/authorization';
import { CVCreator, EmployeeHome, EmployeePersonal } from './pages/employee';
import { EmployerHome, EmployerPersonal, VacancyCreator } from './pages/employer';
import { Error } from './pages/Error/Error';
import { BACKEND } from './axios';
import { LOGGENID_ITEM, START_PAGE_URL, TOKEN_ITEM } from './constants';
import { EmployeeProfile, EmployerProfile } from './pages/profile';
import { Vacancy } from './pages/vacancy';
import { AppContext } from './context/context';
import alertify from 'alertifyjs';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function App() {
  const CONTEXT = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      let updatedContext = {...CONTEXT};

      const token = window.localStorage.getItem(TOKEN_ITEM);

      if(token) {
        try {
          await BACKEND.post('/userData', { token })
          .then(({data}) => {
            if(data.data === 'token expired') {
              alertify.alert('У токена завершився термін дії', () => {
                window.localStorage.removeItem(TOKEN_ITEM);
                window.localStorage.removeItem(LOGGENID_ITEM);
                navigate(START_PAGE_URL);
              });
            } else {
              updatedContext = {...updatedContext, user: data.data};
            }
          });
        } catch(error) {
          alertify.error('Не вдалося отримати токен');
          console.error(error);
        };

      }
  
      CONTEXT.updateState({...CONTEXT, ...updatedContext});
    }

    fetchData();
    
  }, [window.localStorage.getItem(TOKEN_ITEM)]);

  return (
    <div className='app'>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/employee' element={<EmployeeHome />} />
          <Route path='/employee/personal' element={<EmployeePersonal />} />
          <Route path='/employees' element={<EmployeeProfile />} />
          <Route path='/employers' element={<EmployerProfile />} />
          <Route path='/employer' element={<EmployerHome />} />
          <Route path='/employer/personal' element={<EmployerPersonal />} />
          <Route path='/vacancies' element={<Vacancy />} />
          <Route path='/vacancyCreator' element={<VacancyCreator />} />
          <Route path='/CVCreator' element={<CVCreator />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
