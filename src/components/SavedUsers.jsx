import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { BACKEND } from '../axios';
import { EmployeeRow } from './EmployeeRow';
import alertify from 'alertifyjs';

export const SavedUsers = () => {
  const CONTEXT = useContext(AppContext);
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    if(CONTEXT.user && CONTEXT.user.savedUsers) {
      setSavedUsers(CONTEXT.user.savedUsers);
    }
  }, [CONTEXT.user]);
  
  const setEmployeeToList = (type = 'savedUsers', employeeId) => {
    const update = (list) => {
      const updatedUser = { ...CONTEXT.user, savedUsers: list };
      CONTEXT.updateState({ ...CONTEXT, user: updatedUser});
      setSavedUsers(list);
  
      try {
        BACKEND.post('/updateUser', updatedUser).then(response => {
          if(response.data && response.data.status === 'ok') {

          } else {
            alertify.error("Не вдалося оновити дані");
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error("Не вдалося оновити дані");
        console.error(error);
      }
    }

    let list = [...CONTEXT.user.savedUsers];

    if(list.find(e => e._id === employeeId)) {
      list = list.filter(e => e._id !== employeeId);
      update(list);
    } else {
      try {
        BACKEND.post('/getUserById', { _id: employeeId }).then(response => {
          if(response.data && response.data.status === 'ok') {
            const employee = response.data.data;
            list.push(employee);
            update(list);
          } else {
            console.error('Не вдалося оновити дані');
            console.error(response);
          }
        });
      } catch(error) {
        console.error('Не вдалося оновити дані');
        console.error(error);
      }
    }

  };

  return savedUsers && savedUsers.length ? (
    <div className='searched-employees'>
      {savedUsers.map((su, i) => <EmployeeRow key={su._id + '_' + i} setEmployeeToList={setEmployeeToList} hideCV={true} CV={{employee: su}} />)}
    </div>
  ) : <div>Поки немає жодного збереженого робітника</div>
}
