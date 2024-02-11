import React, { useEffect, useState } from 'react'
import { BACKEND } from '../axios';
import { SendFeedback } from './SendFeedback';

export const Feedback = ({userId, sender = '', showAddFeedback = true}) => {
  const [feedback, setFeedback] = useState([]);
  
  useEffect(() => {
    BACKEND.post('/getFeedbackAboutUserById', { userId }).then(response => {
      // console.log(response)
      if(response.data.status === 'ok') {
        let fetchedFeedback = response.data.data;
        if(sender && sender !== '') {
          fetchedFeedback = fetchedFeedback.filter(f => f.sender === sender);
        }
        setFeedback(fetchedFeedback);
      }
    });
  }, []);

  const addFeedbackToList = newFeedbackItem => {
    const newFeedback = [...feedback, newFeedbackItem];
    setFeedback(newFeedback);
  }

  const toFeedbackDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
  }

  return feedback.length ? (
    <div>
      <div className='feedback-list'>
        {feedback.slice(0, 3).map((f, i) => (
          <div key={f._id || `feedback-${i}`} className='feedback-item'>
            <div className='mark'>{f.mark}</div>
            <div className='text'>{f.text}</div>
            <div className='timestamp'>{toFeedbackDate(f.timestamp)}</div>
          </div>
        ))}
      </div>
      { showAddFeedback ? <SendFeedback aboutUser={userId} addFeedback={addFeedbackToList} /> : null }
    </div>
  ) : <div>Немає жодного відгука</div>
}
