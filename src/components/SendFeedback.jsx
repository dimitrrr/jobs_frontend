import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { BACKEND } from '../axios';

export const SendFeedback = ({aboutUser, addFeedback}) => {
  const CONTEXT = useContext(AppContext);
  const [feedback, setFeedback] = useState({
    fromUser: null,
    aboutUser,
    text: '',
    mark: 0,
    sender: 'employee',
  });

  useEffect(() => {
    if(CONTEXT.user && CONTEXT.user._id) {
      setFeedback({...feedback, fromUser: CONTEXT.user._id});
    }

  }, [CONTEXT.user._id]);

  if(feedback.fromUser === aboutUser) {
    return <></>
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFeedback((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedFeedback = { ...feedback, timestamp: Date.now() };

    try {
      BACKEND.post('/createFeedback', updatedFeedback).then(response => {
        if(response.data.status === 'ok') {
          addFeedback(updatedFeedback);
          setFeedback({...feedback, text: '', mark: 0, sender: 'employee'});
        }
      });
    } catch(error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='feedback-form'>
      <div className="form-control">
        <div className="radio">
          <label>
            <input 
              type="radio" 
              value="employee"
              name='sender'
              checked={feedback.sender === 'employee'} 
              onChange={handleInputChange}
            />
            Я робітник
          </label>
        </div>
        <div className="radio">
          <label>
            <input 
              type="radio" 
              name='sender'
              value="employer" 
              checked={feedback.sender === 'employer'} 
              onChange={handleInputChange}
            />
            Я роботодавець
          </label>
        </div>
      </div>
      <div className="form-control">
        <label>Рейтинг</label>
        <input
          type="text"
          name="mark"
          value={feedback.mark}
          onChange={handleInputChange}
        />
      </div>
      <div className="form-control">
        <label>Текст відгуку</label>
        <textarea
          type="text"
          name="text"
          value={feedback.text}
          onChange={handleInputChange}
        />
      </div>
      <button className='button primary-button' type='submit'>Відгукнутися</button>
    </form>
  )
}
