import React from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'

export const Header = () => {
  const location = useLocation();
  const params = useParams();
  const pathname = location.pathname;

  console.log('location', location)
  console.log('params', params.userId)
  
  const isUserAuthorized = true;
  const shouldRenderHeaderForLoginPage = pathname === '/' || pathname === '/registration';
  const shouldShowEmployeeHeader = pathname.includes('/employee');
  const shouldShowEmployeePersonal = pathname === '/employee/' && isUserAuthorized;
  const shouldShowEmployeeHome = shouldShowEmployeeHeader && pathname.includes('/employee/personal');
  const shouldShowEmployerHeader = pathname.includes('/employer');
  const shouldShowEmployerPersonal = pathname === '/employer/' && isUserAuthorized;
  const shouldShowEmployerHome = shouldShowEmployerHeader && pathname.includes('/employer/personal');

  const renderLoginRegistrationLinks = () => {
    return (
      <>
        <li>
          <Link to="/">Увійти</Link>
        </li>
        <li>
          <Link to="/registration">Зареєструватися</Link>
        </li>
        <li>
          <Link to="/employee/">Робітник</Link>
        </li>
        <li>
          <Link to="/employer/">Роботодавець</Link>
        </li>
      </>
    )
  }

  const renderHeaderForLoginPage = () => {
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
            <Link to="/employee/personal">Особистий кабінет робітника</Link>
          </li>
        ) : null }
        <li>
          <Link to="/employer/">Роботодавець</Link>
        </li>
        <li>
          <Link to="/">Вийти</Link>
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
            <Link to="/employer/personal">Особистий кабінет роботодавця</Link>
          </li>
        ) : null }
        <li>
          <Link to="/employee/">Робітник</Link>
        </li>
        <li>
          <Link to="/">Вийти</Link>
        </li>
      </>
    );

  }


  return (
    <div className='header'>
      <nav>
        <ul>
          { isUserAuthorized ? null : renderLoginRegistrationLinks() }
          { shouldShowEmployeeHeader ? renderEmployeeHeader() : null }
          { shouldShowEmployerHeader ? renderEmployerHeader() : null }
          { shouldRenderHeaderForLoginPage ? renderHeaderForLoginPage() : null }
        </ul>
      </nav>
    </div>
  )
}
