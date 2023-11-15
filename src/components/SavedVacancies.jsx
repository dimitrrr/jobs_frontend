import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context'
import { VacancyRow } from './VacancyRow';
import { BACKEND } from '../axios';

export const SavedVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const [savedVacancies, setSavedVacancies] = useState([]);

  useEffect(() => {
    if(CONTEXT.user && CONTEXT.user.savedVacancies) {
      setSavedVacancies(CONTEXT.user.savedVacancies);
    }
  }, [CONTEXT.user]);
  
  const setVacancyToList = (type = 'savedVacancies', vacancyId) => {
    let list = [...CONTEXT.user.savedVacancies];

    if(list.find(v => v._id === vacancyId)) {
      list = list.filter(v => v._id !== vacancyId);
    } else {
      list.push(vacancyId);
    }

    const updatedUser = { ...CONTEXT.user, savedVacancies: list };
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser, lastUpdateTime: Date.now() });
    setSavedVacancies(list);
 
    BACKEND.post('/updateUser', updatedUser).then(response => {
    });
  };

  return (
    <div>
      Збережені вакансії
      {savedVacancies.map(sv => <VacancyRow key={sv._id} isForEmployer={false} isSavedVacancy={true} isHiddenVacancy={false} setVacancyToList={setVacancyToList} vacancy={sv} />)}
    </div>
  )
}
