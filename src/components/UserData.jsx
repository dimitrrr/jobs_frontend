import React, { useContext, useState } from 'react'
import { AppContext } from '../context/context'
import { BACKEND } from '../axios';
import TimezoneSelect, { allTimezones } from "react-timezone-select";

export const UserData = () => {
  const CONTEXT = useContext(AppContext);
  const userData = CONTEXT.user;

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
      <button onClick={() => setCurrentMode(2)}>Редагувати</button>
      <div>{ userData && userData.username }</div>
      <div>{ userData && userData.email }</div>
      <div>{ timeZone && timeZone.label ? timeZone.label : timeZone }</div>
      </>
    )
  }

  const renderEditMode = () => {
    return (

      <form onSubmit={handleSubmit}>
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
        <button type='submit'>Зберегти</button>
        <button type='button' onClick={() => setCurrentMode(1)}>Скасувати</button>
    </form>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const updatedUser = { ...CONTEXT.user, ...userState, timeZone: JSON.stringify(timeZone) };
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser });
 
    BACKEND.post('/updateUser', updatedUser).then(response => {
      setCurrentMode(1);
    });
  };

  return (
    <div>
      <div>Для того, щоб відкрити всі можливості роботодавця, вкажіть інформацію про свою компанію.</div>
      { currentMode === 1 ? renderShowMode() : null }
      { currentMode === 2 ? renderEditMode() : null }
    </div>
  )
}
