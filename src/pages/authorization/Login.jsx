import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const Login = () => {
  const [state, setState] = useState({
    email: "",
    password: "",
  });

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
        <div className="form-control">
          <label></label>
          <button type="submit">Увійти</button>
        </div>
        <Link to='/registration'>Перейти до реєстрації</Link>
      </form>
    </div>
  )
}
