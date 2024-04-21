import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context'
import { VacancyRow } from './VacancyRow';
import { BACKEND } from '../axios';
import alertify from 'alertifyjs';

export const SavedVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const [savedVacancies, setSavedVacancies] = useState([]);

  useEffect(() => {
    if(CONTEXT.user && CONTEXT.user.savedVacancies) {
      setSavedVacancies(CONTEXT.user.savedVacancies);
    }
  }, [CONTEXT.user]);
  
  const setVacancyToList = (type = 'savedVacancies', vacancyId) => {
    const update = (list) => {
      const updatedUser = { ...CONTEXT.user, savedVacancies: list };
      CONTEXT.updateState({ ...CONTEXT, user: updatedUser});
      setSavedVacancies(list);

      try {
        BACKEND.post('/updateUser', updatedUser).then(response => {
          if(response.data && response.data.status === 'ok') {

          } else {
            alertify.error('Не вдалося оновити дані');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося оновити дані');
        console.error(error);
      }
    }

    let list = [...CONTEXT.user.savedVacancies];

    if(list.find(v => v._id === vacancyId)) {
      list = list.filter(v => v._id !== vacancyId);
      update(list);
    } else {
      try {
        BACKEND.post('/getVacancyById', { _id: vacancyId }).then(response => {
          if(response.data && response.data.status === 'ok' && response.data.data) {
            const vacancy = response.data.data;
            list.push(vacancy);
            update(list);
          } else {
            alertify.error('Не вдалося оновити дані');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося оновити дані');
        console.error(error);
      }
    }

  };

  return savedVacancies && savedVacancies.length ? (
    <div>
      {savedVacancies.map(sv => <VacancyRow key={sv._id + Date.now()} isForEmployer={false} isSavedVacancy={true} isHiddenVacancy={false} setVacancyToList={setVacancyToList} vacancy={sv} />)}
    </div>
  ) : <div>Поки немає жодної збереженої вакансії</div>
}
