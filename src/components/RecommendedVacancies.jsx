import React, { useContext, useEffect, useState } from 'react'
import { VacancyRow } from './VacancyRow';
import { AppContext } from '../context/context';
import { BACKEND } from '../axios';
import { checkSimilarity } from '../helpers';

export const RecommendedVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    try {
      BACKEND.post('/getAddedCVsById', { employee: CONTEXT.user._id }).then(response => {
        if(response.data.status === 'ok' && response.data.data) {
          const CVs = response.data.data;

          const newRecommended = [];
  
          if(CVs && CVs.length) {
            BACKEND.post('/postedVacancies')
            .then((response) => {
              if(response.data.status === 'ok' && response.data.data && response.data.data.length) {
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
                }
              }
            });
          }

        }
      });
    } catch(error) {
      console.error(error);
      setRecommendations([]);
    }
  }, [CONTEXT.user._id]);

  return recommendations && recommendations.length ? (
    <div>
      {recommendations.map((r, i) => (
        <div key={i + Date.now()}>
        <div className='recommended-header'>Рекомендовані вакансії для ролі <b>{r.role}</b></div>

        {r.vacancies.map(rv => <VacancyRow key={rv._id + Date.now()} vacancy={rv} />)}
        </div> ))}
    </div>
  ) : <div>Поки що система не може порекомендувати жодної вакансії</div>
  
}
