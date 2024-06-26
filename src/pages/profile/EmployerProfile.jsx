import React, { useEffect, useState } from 'react'
import { EmployerData, Feedback } from '../../components';
import { BACKEND } from '../../axios';
import alertify from 'alertifyjs';

export const EmployerProfile = () => {
  const [employer, setEmployer] = useState({
    name: '',
    testTaskLink: '',
    description: '',
    area: '',
    logo: '',
    _id: null,
  });


  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const employerId = urlParams.get('employer_id');

    try {
      BACKEND.post('/getUserById', { _id: employerId }).then(response => {
        if(response.data && response.data.status === 'ok') {
          const user = response.data.data;
          const company = JSON.parse(user.company || "{}");
          setEmployer({...company, _id: user._id});
        } else {
          alertify.error('Не вдалося отримати дані');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося отримати дані');
      console.error(error);
    }

  }, []);

  return employer && employer._id ? (
    <div className='employer-page'>
      <EmployerData timeZone={employer.timeZone} employerId={employer._id} company={employer} shortForm={false} />
      <Feedback userId={employer._id} sender='employee'/>
    </div>
  ) : null
}
