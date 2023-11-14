import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LOGGENID_ITEM, START_PAGE_URL, TOKEN_ITEM } from '../constants';
import { AppContext } from '../context/context';

export const Header = () => {
  const CONTEXT = useContext(AppContext);
  const userData = CONTEXT.user;
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  
  const isUserAuthorized = !!window.localStorage.getItem(LOGGENID_ITEM);
  const shouldShowEmployeeHeader = pathname.includes('/employee');
  const shouldShowEmployeePersonal = (pathname === '/employee' || pathname === '/employee/') && isUserAuthorized;
  const shouldShowEmployeeHome = shouldShowEmployeeHeader && pathname.includes('/employee/personal');
  const shouldShowEmployerHeader = pathname.includes('/employer') || pathname.includes('/vacancyCreator');
  const shouldShowEmployerPersonal = (pathname === '/employer' || pathname === '/employer/') && isUserAuthorized;
  const shouldShowEmployerHome = shouldShowEmployerHeader && (pathname.includes('/employer/personal') || pathname === '/vacancyCreator');

  const logOut = () => {
    window.localStorage.removeItem(TOKEN_ITEM);
    window.localStorage.removeItem(LOGGENID_ITEM);
    navigate(START_PAGE_URL);
  }

  const renderLoginRegistrationLinks = () => {
    return (
      <>
        <li>
          <Link to="/employee/">Робітник</Link>
        </li>
        <li>
          <Link to="/employer/">Роботодавець</Link>
        </li>
      </>
    )
  }

  const renderEmployeeHeader = () => {

    return (
      <>
        { shouldShowEmployeeHome ? (
          <li>
            <Link to="/employee/">Головна сторінка</Link>
          </li>
        ) : null }
        { shouldShowEmployeePersonal ? (
          <li>
            <Link to="/employee/personal">Особистий кабінет робітника {userData ? userData.username : ''}</Link>
          </li>
        ) : null }
        <li>
          <Link to="/employer/">Роботодавець</Link>
        </li>
        <li>
          <button onClick={logOut}>
            Вийти
          </button>
        </li>
      </>
    );
  }

  const renderEmployerHeader = () => {

    return (
      <>
        { shouldShowEmployerHome ? (
          <li>
            <Link to="/employer/">Головна сторінка</Link>
          </li>
        ) : null }
        { shouldShowEmployerPersonal ? (
          <li>
            <Link to="/employer/personal">Особистий кабінет роботодавця {userData ? userData.username : ''}</Link>
          </li>
        ) : null }
        <li>
          <Link to="/employee/">Робітник</Link>
        </li>
        <li>
          <button onClick={logOut}>
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
