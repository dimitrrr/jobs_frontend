import React, { useContext, useState } from 'react'
import { AppContext } from '../context/context'
import { BACKEND } from '../axios';
import TimezoneSelect, { allTimezones } from "react-timezone-select";
import { useLocation } from 'react-router-dom';
import alertify from 'alertifyjs';

export const UserData = () => {
  const CONTEXT = useContext(AppContext);
  const userData = CONTEXT.user;
  const location = useLocation();
  const pathname = location.pathname;

  const isEmployer = pathname && pathname.includes('/employer');

  const [timeZone, setTimeZone] = useState(
    userData.timeZone ? JSON.parse(userData.timeZone) : Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const [userState, setUserState] = useState({
    username: userData && userData.username ? userData.username : '',
    email: userData && userData.email ? userData.email : '',
  });

  const [currentMode, setCurrentMode] = useState(1);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserState((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const renderShowMode = () => {
    return (
      <>
      <button className='button secondary-button' onClick={() => setCurrentMode(2)}>Редагувати</button>
      <div className='user-data'>{ userData && userData.username }</div>
      <div className='user-data'>{ userData && userData.email }</div>
      <div className='user-data'>{ timeZone && timeZone.label ? timeZone.label : timeZone }</div>
      </>
    )
  }

  const renderEditMode = () => {
    return (

      <form onSubmit={handleSubmit} className='edit-mode-form'>
        <div className="form-control">
          <label>Імʼя</label>
          <input
            type="text"
            name="username"
            value={userState.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control">
          <label>Адреса електронної пошти</label>
          <input
            type="text"
            name="email"
            value={userState.email}
            onChange={handleInputChange}
          />
        </div>
          <div className="timezone--wrapper">
            <TimezoneSelect
              value={timeZone}
              onChange={setTimeZone}
              labelStyle="altName"
              timezones={{
                ...allTimezones
              }}
            />
          </div>
          <div className="buttons">
            <button type='submit' className='button primary-button'>Зберегти</button>
            <button className='button secondary-button' onClick={() => setCurrentMode(1)}>Скасувати</button>
          </div>
      </form>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const updatedUser = { ...CONTEXT.user, ...userState, timeZone: JSON.stringify(timeZone) };
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser});

    try {
      BACKEND.post('/updateUser', updatedUser).then(response => {
        if(response.data && response.data.status === 'ok') {
          setCurrentMode(1);
        } else {
          alertify.error('Не вдалося оновити дані');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося оновити дані');
      console.error(error);
    }
  };

  return (
    <div className='worker-page'>
      {isEmployer ? <div>Для того, щоб відкрити всі можливості роботодавця, вкажіть інформацію про свою компанію.</div> : null}
      { currentMode === 1 ? renderShowMode() : null }
      { currentMode === 2 ? renderEditMode() : null }
    </div>
  )
}
