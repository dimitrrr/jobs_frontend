import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { CV_CREATOR_URL } from '../constants';
import { BACKEND } from '../axios';

export const AddedCVs = () => {
    const CONTEXT = useContext(AppContext);
    const navigate = useNavigate();
    const [addedCVs, setAddedCVs] = useState([]);
  
    useEffect(() => {
      if(CONTEXT.user && CONTEXT.user._id) {
        BACKEND.post('/getAddedCVsById', { employee: CONTEXT.user._id }).then(response => {
          if(response.data.status === 'ok' && response.data.data) {
            const CVs = response.data.data;
  
            setAddedCVs(CVs);
          }
        });
      }
    }, [CONTEXT.user._id]);
  
    const toCVDate = (timestamp) => {
      const date = new Date(timestamp);
      return date.getHours() + ":" + date.getMinutes() + ", "+ date.toDateString();
    }
    const renderCVs = () => {
      if(!addedCVs || !addedCVs.length) return <></>
  
      return addedCVs.map(cv => (
      <div className='resume-item' key={cv._id}>
        <div className='role'>{cv.CVData.role}</div>
        <div className='timestamp'>Додано: {toCVDate(cv.timestamp)}</div>
        <button className='button primary-button' onClick={() => removeCV(cv._id)}>Видалити резюме</button>
      </div>
      ));
    }
  
    const moveToCVCreator = id => {
      navigate(`${CV_CREATOR_URL}?CV_id=${id}`);
    }

    const removeCV = (_id) => {
      BACKEND.post('/removeCV', { employeeId: CONTEXT.user._id, CVid: _id }).then(response => {
        const newCVs = addedCVs.filter(cv => cv._id !== _id);
        setAddedCVs(newCVs);
      });
    }
  
    return (
      <div className='vacancies'>
        <button className='button primary-button' onClick={() => moveToCVCreator('new')}>Створити резюме</button>
        <div className="posted-resumes">
          {renderCVs()}
        </div>
      </div>
    )
}
