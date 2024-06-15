import React, { useEffect, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import { BACKEND } from '../axios';
import { SendFeedback } from './SendFeedback';
import alertify from 'alertifyjs';

export const Feedback = ({userId, sender = '', showAddFeedback = true}) => {
  const [feedback, setFeedback] = useState([]);
  
  useEffect(() => {
    try {
      BACKEND.post('/getFeedbackAboutUserById', { userId }).then(response => {
        if(response.data && response.data.status === 'ok') {
          let fetchedFeedback = response.data.data;
          if(sender && sender !== '') {
            fetchedFeedback = fetchedFeedback.filter(f => f.sender === sender);
          }
          setFeedback(fetchedFeedback);
        } else {
          alertify.error('Не вдалося отримати відгуки');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося отримати відгуки');
      console.error(error);
    }
  }, []);

  const addFeedbackToList = newFeedbackItem => {
    const newFeedback = [...feedback, newFeedbackItem];
    setFeedback(newFeedback);
  }

  const toFeedbackDate = (timestamp) => {
    const date = new Date(timestamp);

    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    const formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime + ", "+ date.toDateString();
  }

  const fromUser = f => f.fromUser ? f.fromUser.username ? f.fromUser.username : 'Ви' : 'Анонімний користувач';

  return (
    <div>
      {feedback.length ? (<div>
        <div className='feedback-list'>
          {feedback.reverse().slice(0, 3).map((f, i) => (
            <div key={f._id || `feedback-${i}`} className='feedback-item'>
              <div className='from'>Від: {fromUser(f)}</div>
              {f.mark ? <Rating size={20} readonly={true} initialValue={parseInt(f.mark)} /> : null}
              <div className='text'>{f.text}</div>
              <div className='timestamp'>{toFeedbackDate(f.timestamp)}</div>
            </div>
          ))}
        </div>
      </div>
    ) : <div>Немає жодного відгука</div>}
    { showAddFeedback ? <SendFeedback aboutUser={userId} addFeedback={addFeedbackToList} /> : null }
  </div>
  )
}
