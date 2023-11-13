import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import TimezoneSelect, { allTimezones } from "react-timezone-select";

export const Registration = () => {
  const [state, setState] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [tz, setTz] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(state);
  };


  return (
    <div className='registration'>
        <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Імʼя</label>
          <input
            type="text"
            name="username"
            value={state.username}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control">
          <label>Електронна пошта</label>
          <input
            type="text"
            name="email"
            value={state.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control">
          <label>Пароль</label>
          <input
            type="password"
            name="password"
            value={state.password}
            onChange={handleInputChange}
          />
        </div>
        <div className="timezone--wrapper">
          <TimezoneSelect
            value={tz}
            onChange={setTz}
            labelStyle="altName"
            timezones={{
              ...allTimezones
            }}
          />
        </div>
        <div className="form-control">
          <label></label>
          <button type="submit">Зареєструватися</button>
        </div>
        <Link to='/'>Перейти до авторизації</Link>
      </form>
    </div>
  )
}
