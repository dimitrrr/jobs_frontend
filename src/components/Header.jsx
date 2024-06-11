import React, { useContext, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_URL, DEFAULT_EXTERNAL_URL, EMPLOYEE_SEARCH_RESULTS, LOGGENID_ITEM, START_PAGE_URL, TOKEN_ITEM, VACANCIES_SEARCH_RESULTS } from '../constants';
import { AppContext } from '../context/context';

export const Header = () => {
  const CONTEXT = useContext(AppContext);
  const [ userData, setUserData ] = useState({});

  useEffect(() => {
    setUserData(CONTEXT.user);
  }, [CONTEXT.user]);

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  
  const isUserAuthorized = !!window.localStorage.getItem(LOGGENID_ITEM);
  const shouldShowEmployeeHeader = pathname.includes('/employee') || pathname.includes('/vacancies') || pathname === '/CVCreator';
  const shouldShowEmployeePersonal = (pathname === '/employee' || pathname === '/employee/') && isUserAuthorized;
  const shouldShowEmployeeHome = shouldShowEmployeeHeader && (pathname.includes('/employee/personal') || pathname.includes('/vacancies') || pathname === '/CVCreator');
  const shouldShowEmployerHeader = pathname.includes('/employer') || pathname.includes('/vacancyCreator');
  const shouldShowEmployerPersonal = (pathname === '/employer' || pathname === '/employer/') && isUserAuthorized;
  const shouldShowEmployerHome = shouldShowEmployerHeader && (pathname.includes('/employer/personal') || pathname === '/vacancyCreator');

  const logOut = () => {
    window.localStorage.removeItem(TOKEN_ITEM);
    window.localStorage.removeItem(LOGGENID_ITEM);
    window.localStorage.removeItem(VACANCIES_SEARCH_RESULTS);
    window.localStorage.removeItem(EMPLOYEE_SEARCH_RESULTS);
    CONTEXT.updateState({...CONTEXT, user: {}});
    navigate(0);
    const defaultPage = process.env.NODE_ENV === 'production' ? DEFAULT_EXTERNAL_URL : DEFAULT_URL;
    window.location.replace(defaultPage + START_PAGE_URL);
  }

  const renderLoginRegistrationLinks = () => {
    return (
      <>
        <li>
          <Link to="/employee/">До робітника</Link>
        </li>
        <li>
          <Link to="/employer/">До роботодавця</Link>
        </li>
        <li>
          <Link to='/'>Увійти</Link>
        </li>
      </>
    )
  }

  const renderEmployeeHeader = () => {
    if(!isUserAuthorized) return <></>

    return (
      <>
        { shouldShowEmployeeHome ? (
          <li>
            <Link to="/employee/">Головна сторінка</Link>
          </li>
        ) : null }
        { shouldShowEmployeePersonal ? (
          <li>
            <Link to="/employee/personal">Особистий кабінет робітника <span style={{ textDecoration: 'underline' }}>{userData ? userData.username : ''}</span></Link>
          </li>
        ) : null }
        <li>
          <Link to="/employer/">До роботодавця</Link>
        </li>
        <li className='logout'>
          <button className='button primary-button' onClick={logOut}>
            Вийти
          </button>
        </li>
      </>
    );
  }

  const renderEmployerHeader = () => {
    if(!isUserAuthorized) return <></>

    return (
      <>
        { shouldShowEmployerHome ? (
          <li>
            <Link to="/employer/">Головна сторінка</Link>
          </li>
        ) : null }
        { shouldShowEmployerPersonal ? (
          <li>
            <Link to="/employer/personal">Особистий кабінет роботодавця <span style={{ textDecoration: 'underline' }}>{userData ? userData.username : ''}</span></Link>
          </li>
        ) : null }
        <li>
          <Link to="/employee/">До робітника</Link>
        </li>
        <li className='logout'>
          <button className='button primary-button' onClick={logOut}>
            Вийти
          </button>
        </li>
      </>
    );

  }


  return (
    <div className='header'>
      <nav>
        <ul className='navbar'>
          { isUserAuthorized ? null : renderLoginRegistrationLinks() }
          { shouldShowEmployeeHeader ? renderEmployeeHeader() : null }
          { shouldShowEmployerHeader ? renderEmployerHeader() : null }
        </ul>
      </nav>
    </div>
  )
}
