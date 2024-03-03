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
      const update = (list) => {
        const updatedUser = { ...CONTEXT.user, hiddenVacancies: list };
        CONTEXT.updateState({ ...CONTEXT, user: updatedUser});
     
        BACKEND.post('/updateUser', updatedUser).then(response => {
        });
  
        setHiddenVacancies(list);
      } 

      let list = [...CONTEXT.user.hiddenVacancies];
  
      if(list.find(v => v._id === vacancyId)) {
        list = list.filter(v => v._id !== vacancyId);
        update(list)
      } else {
        BACKEND.post('/getVacancyById', { _id: vacancyId }).then(response => {
          if(response.data.status === 'ok' && response.data.data) {
            const vacancy = response.data.data;
            list.push(vacancy);
            update(list);
          }
        });
      }
  
    };
  
    return hiddenVacancies && hiddenVacancies.length ? (
      <div>
        {hiddenVacancies.map(sv => <VacancyRow key={sv._id + Date.now()} isForEmployer={false} isSavedVacancy={false} isHiddenVacancy={true} setVacancyToList={setVacancyToList} vacancy={sv} />)}
      </div>
    ) : <div>Поки немає жодної прихованої вакансії</div>
}
