import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { BACKEND } from '../axios';
import { EmployeeRow } from './EmployeeRow';

export const SavedUsers = () => {
  const CONTEXT = useContext(AppContext);
  const [savedUsers, setSavedUsers] = useState([]);

  useEffect(() => {
    if(CONTEXT.user && CONTEXT.user.savedUsers) {
      setSavedUsers(CONTEXT.user.savedUsers);
    }
  }, [CONTEXT.user]);
  
  const setEmployeeToList = (type = 'savedUsers', vacancyId) => {
    let list = [...CONTEXT.user.savedUsers];

    if(list.find(v => v._id === vacancyId)) {
      list = list.filter(v => v._id !== vacancyId);
    } else {
      list.push(vacancyId);
    }

    const updatedUser = { ...CONTEXT.user, savedUsers: list };
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser});
    setSavedUsers(list);
 
    BACKEND.post('/updateUser', updatedUser).then(response => {
    });
  };

  return (
    <div>
      Збережені робітники
      {savedUsers.map(su => <EmployeeRow key={su._id} setEmployeeToList={setEmployeeToList} hideCV={true} CV={{employee: su}} />)}
    </div>
  )
}
