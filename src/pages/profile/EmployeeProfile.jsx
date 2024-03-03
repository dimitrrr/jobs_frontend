import React, { useEffect, useState } from 'react'
import { BACKEND } from '../../axios';
import { EmployeeData, Feedback } from '../../components';

export const EmployeeProfile = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const employeeId = urlParams.get('employee_id');

    BACKEND.post('/getUserById', { _id: employeeId }).then(response => {
      if(response.data.status === 'ok') {
        setUserData(response.data.data);
      }
    });
  }, []);

  return userData && userData._id ? (
    <div>
      <EmployeeData employee={userData} />
      <Feedback userId={userData._id} sender='employer' />
    </div>
  ) : null
}
