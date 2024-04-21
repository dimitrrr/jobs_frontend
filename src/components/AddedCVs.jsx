import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { CV_CREATOR_URL } from '../constants';
import { BACKEND } from '../axios';
import alertify from 'alertifyjs';

export const AddedCVs = () => {
    const CONTEXT = useContext(AppContext);
    const navigate = useNavigate();
    const [addedCVs, setAddedCVs] = useState([]);
  
    useEffect(() => {
      if(CONTEXT.user && CONTEXT.user._id) {
        try {
          BACKEND.post('/getAddedCVsById', { employee: CONTEXT.user._id }).then(response => {
            if(response.data && response.data.status === 'ok' && response.data.data) {
              const CVs = response.data.data;
    
              setAddedCVs(CVs);
            } else {
              alertify.error('Не вдалося отримати резюме');
              console.error(response);
            }
          });
        } catch(error) {
          alertify.error('Не вдалося отримати резюме');
          console.error(error);
        }
      }
    }, [CONTEXT.user._id]);
  
    const toCVDate = (timestamp) => {
      const date = new Date(timestamp);

      const hours = date.getHours();
      const minutes = "0" + date.getMinutes();

      const formattedTime = hours + ':' + minutes.substr(-2);
      return formattedTime + ", "+ date.toDateString();
    }
    const renderCVs = () => {
      if(!addedCVs || !addedCVs.length) return <></>
  
      return addedCVs.map(cv => (
      <div className='resume-item' key={cv._id}>
        <div className='role'>{cv.CVData ? cv.CVData.role : ''}</div>
        <div className='timestamp'>Додано: {toCVDate(cv.timestamp)}</div>
        <div>
          <input type='checkbox' checked={cv.visible == undefined ? true : cv.visible} onChange={(event) => handleCheckboxChange(event, cv._id)} /> Публічне
        </div>
        <button className='button primary-button' onClick={() => removeCV(cv._id)}>Видалити резюме</button>
      </div>
      ));
    }
  
    const moveToCVCreator = id => {
      navigate(`${CV_CREATOR_URL}?CV_id=${id}`);
    }

    const removeCV = (_id) => {
      try {
        BACKEND.post('/removeCV', { employeeId: CONTEXT.user._id, CVid: _id }).then(response => {
          if(response.data && response.data.status === 'ok') { 
            const newCVs = addedCVs.filter(cv => cv._id !== _id);
            setAddedCVs(newCVs);
          } else {
            alertify.error('Не вдалося видалити резюме');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося видалити резюме');
        console.error(error);
      }
    }


  const handleCheckboxChange = (event, id) => {
    const value = event.target.checked;
    const newCVs = [...addedCVs];

    const CV = newCVs.find(cv => cv._id === id);

    if(CV) {
      CV.visible = value;
      try {
        BACKEND.post('/updateCV', CV).then(response => {
          if(response.data && response.data.status === 'ok') {
            setAddedCVs(newCVs);
          } else {
            alertify.error('Не вдалося змінити статус резюме');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося змінити статус резюме');
        console.error(error);
      }
    }
    
  }
  
    return (
      <div className='vacancies'>
        <button className='button primary-button' onClick={() => moveToCVCreator('new')}>Створити резюме</button>
        <div>Для того, щоб приховати свої дані під час пошуку потенційних робітників роботодавцем, позначте резюме як непублічні.</div>
        <div className="posted-resumes">
          {renderCVs()}
        </div>
      </div>
    )
}
