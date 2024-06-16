import React, { useEffect, useState } from 'react'
import { BACKEND } from '../../axios';
import { EmployeeData, Feedback } from '../../components';
import alertify from 'alertifyjs';
import { savePdf } from '../../helpers';

export const EmployeeProfile = () => {
  const [userData, setUserData] = useState({});
  const [CVs, setCVs] = useState([]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const employeeId = urlParams.get('employee_id');

    try {
      BACKEND.post('/getUserById', { _id: employeeId }).then(response => {
        if(response.data && response.data.status === 'ok') {
          setUserData(response.data.data);
        } else {
          alertify.error('Не вдалося отримати дані');
          console.error(response);
        }
      });

      try {
        BACKEND.post('/getAddedCVsById', { employee: employeeId }).then(response => {
          if(response.data && response.data.status === 'ok') {
            const CVs = response.data.data.filter(cv => cv.visible);
            
            setCVs(CVs);
          } else {
            alertify.error('Не вдалося отримати резюме');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося отримати резюме');
        console.error(error);
      }

    } catch(error) {
      alertify.error('Не вдалося отримати дані');
      console.error(error);
    }
  }, []);
  
  const toCVDate = (timestamp) => {
    const date = new Date(timestamp);

    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    const formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime + ", "+ date.toDateString();
  }

  const downloadCV = (CV) => {
    if(!CV || !CV.file || !CV.file.data) {
      alertify.error('Не вдалося знайти резюме');
      return;
    }

    savePdf(CV.file.data);
  }

  return userData && userData._id ? (
    <div className='employee-profile'>
      <EmployeeData employee={userData} />
      <div>
        <h3>Додані резюме</h3>
        {CVs.length ? CVs.map(cv => (
        <div className='resume-item' key={cv._id}>
          <div className='role' onClick={() => downloadCV(cv)}>{cv.CVData ? cv.CVData.role : ''}</div>
          <div className='timestamp'>Додано: {toCVDate(cv.timestamp)}</div>
        </div>
        )) : null}
      </div>
      <h3>Відгуки</h3>
      <Feedback userId={userData._id} sender='employer' />
    </div>
  ) : null
}
