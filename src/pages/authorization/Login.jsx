import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BACKEND } from '../../axios';
import { DEFAULT_PAGE_AFTER_LOGIN_URL, LOGGENID_ITEM, TOKEN_ITEM } from '../../constants';

export const Login = () => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const isLoggedIn = window.localStorage.getItem(LOGGENID_ITEM);

  useEffect(() => {
    if(isLoggedIn) {
      navigate(DEFAULT_PAGE_AFTER_LOGIN_URL);
    }
  }, [isLoggedIn]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    try {
      BACKEND.post('/login', state).then(response => {
        console.log(response);
        if(response.data.status === 'ok') {
          alert('login successful');
          window.localStorage.setItem(TOKEN_ITEM, response.data.data);
          window.localStorage.setItem('loggedIn', true);
          navigate(DEFAULT_PAGE_AFTER_LOGIN_URL);
        }
      });
    } catch(error) {
      console.log(error);
    }
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
