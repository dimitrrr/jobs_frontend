import React, { useEffect, useState } from 'react'
import { BACKEND } from '../axios';
import { SendFeedback } from './SendFeedback';

export const Feedback = ({userId, sender = '', showAddFeedback = true}) => {
  const [feedback, setFeedback] = useState([]);
  
  useEffect(() => {
    BACKEND.post('/getFeedbackAboutUserById', { userId }).then(response => {
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

  return (
    <div>
      <div>
        {feedback.map((f, i) => (
          <div key={f._id || `feedback-${i}`}>
            {f.mark}
            {f.text}
            {f.timestamp}
          </div>
        ))}
      </div>
      { showAddFeedback ? <SendFeedback aboutUser={userId} addFeedback={addFeedbackToList} /> : null }
    </div>
  )
}
