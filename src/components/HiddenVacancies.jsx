import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { BACKEND } from '../axios';
import { VacancyRow } from './VacancyRow';

export const HiddenVacancies = () => {
    const CONTEXT = useContext(AppContext);
    const [hiddenVacancies, setHiddenVacancies] = useState([]);
  
    useEffect(() => {
      if(CONTEXT.user && CONTEXT.user.hiddenVacancies) {
        setHiddenVacancies(CONTEXT.user.hiddenVacancies);
      }
    }, [CONTEXT.user._id]);
    
    const setVacancyToList = (type = 'hiddenVacancies', vacancyId) => {
      let list = [...CONTEXT.user.hiddenVacancies];
  
      if(list.find(v => v._id === vacancyId)) {
        list = list.filter(v => v._id !== vacancyId);
      } else {
        list.push(vacancyId);
      }
  
      const updatedUser = { ...CONTEXT.user, hiddenVacancies: list };
      CONTEXT.updateState({ ...CONTEXT, user: updatedUser});
   
      BACKEND.post('/updateUser', updatedUser).then(response => {
      });

      setHiddenVacancies(list);
    };
  
    return hiddenVacancies ? (
      <div>
        {hiddenVacancies.map(sv => <VacancyRow key={sv._id} isForEmployer={false} isSavedVacancy={false} isHiddenVacancy={true} setVacancyToList={setVacancyToList} vacancy={sv} />)}
      </div>
    ) : <div>Поки немає жодної прихованої вакансії</div>
}
