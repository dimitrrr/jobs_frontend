import React, { useEffect, useState } from 'react'
import { BACKEND } from '../../axios';
import { EmployeeData, Feedback } from '../../components';
import alertify from 'alertifyjs';

export const EmployeeProfile = () => {
  const [userData, setUserData] = useState({});

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
    } catch(error) {
      alertify.error('Не вдалося отримати дані');
      console.error(error);
    }
  }, []);

  return userData && userData._id ? (
    <div>
      <EmployeeData employee={userData} />
      <Feedback userId={userData._id} sender='employer' />
    </div>
  ) : null
}
