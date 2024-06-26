import React, { useContext, useEffect, useState } from 'react'
import { VacancyRow } from './VacancyRow';
import { AppContext } from '../context/context';
import { BACKEND } from '../axios';
import { checkSimilarity } from '../helpers';
import alertify from 'alertifyjs';

export const RecommendedVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    try {
      BACKEND.post('/getAddedCVsById', { employee: CONTEXT.user._id }).then(response => {
        if(response.data && response.data.status === 'ok' && response.data.data) {
          const CVs = response.data.data;

          const newRecommended = [];
  
          if(CVs && CVs.length) {
            BACKEND.post('/postedVacancies')
            .then((response) => {
              if(response.data && response.data.status === 'ok' && response.data.data && response.data.data) {
                const vacancies = response.data.data;
                
                if(vacancies && vacancies.length) {

                  CVs.forEach(CV => {
                    if(!CV || !CV.CVData || !CV.CVData.role) return;

                    const similar = vacancies.map(v => {
                      return {
                        vacancy: v,
                        similarity: checkSimilarity(JSON.stringify(CV.CVData).toLowerCase(), (v.name + v.text).toLowerCase()),
                      }
                    });

                    similar.sort((a, b) => b.similarity - a.similarity);

                    const newRecommendedByRole = {
                      role: CV.CVData.role,
                      vacancies: similar.map(s => s.vacancy).slice(0, 3),
                    }; 


                    newRecommended.push(newRecommendedByRole);

                  });

                  setRecommendations(newRecommended);
                } else {
                  alertify.error("Не вдалося отримати рекомендації");
                  console.error(response);
                }
              } else {
                alertify.error("Не вдалося отримати рекомендації");
                console.error(response);
              }
            });
          } else {
            alertify.error("Не вдалося отримати рекомендації");
            console.error(CVs);
          }

        } else {
          alertify.error("Не вдалося отримати рекомендації");
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося отримати рекомендації');
      console.error(error);
      setRecommendations([]);
    }
  }, [CONTEXT.user._id]);

  const setVacancyToList = (listName, vacancyId) => {
    const update = (list) => {
      const updatedUser = { ...CONTEXT.user, [listName]: list };
      CONTEXT.updateState({ ...CONTEXT, user: updatedUser });

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

    let list = [...CONTEXT.user[listName]];

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

  return recommendations && recommendations.length ? (
    <div>
      {recommendations.map((r, i) => (
        <div key={i + Date.now()}>
        <div className='recommended-header'>Рекомендовані вакансії для ролі <b>{r.role}</b></div>

        {r.vacancies.map(rv => <VacancyRow key={rv._id + Date.now()} vacancy={rv} setVacancyToList={setVacancyToList}/>)}
        </div> ))}
    </div>
  ) : <div>Поки що система не може порекомендувати жодної вакансії</div>
  
}
