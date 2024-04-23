import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context'
import { VacancyRow } from './VacancyRow';
import { BACKEND } from '../axios';
import alertify from 'alertifyjs';

const statuses = {
  pending: 'Заявка на розгляді',
  accepted: 'Заявка прийнята, очікуйте, коли роботодавець звʼяжеться',
  denied: 'Заявка відхилена',
}

export const CandidateVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    try {
      BACKEND.post('/getCandidatesByEmployeeId', { _id: CONTEXT.user._id }).then(response => {
        if(response.data && response.data.status === 'ok' && response.data.data) {
          const currentUserVacancies = response.data.data;
          setCandidates(currentUserVacancies);
        } else {
          alertify.error('Не вдалося отримати список вакансій');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося отримати список вакансій');
      console.error(error);
    }

  }, [CONTEXT.user._id]);

  const removeCandidate = (_id) => {
    const newCandidates = candidates.filter(c => c._id !== _id);
    setCandidates(newCandidates);

    try {
      BACKEND.post('/removeCandidate', { _id }).then(response => {
        if(response.data && response.data.status === 'ok') {
        } else {
          alertify.error('Не вдалося видалити заявку');
          console.error(response);
        }

      });
    } catch(error) {
      alertify.error('Не вдалося видалити заявку');
      console.error(error);
    }

  }

  const toCandidatekDate = (timestamp) => {
    const date = new Date(timestamp);

    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();

    const formattedTime = hours + ':' + minutes.substr(-2);
    return formattedTime + ", "+ date.toDateString();
  }

  return candidates.length ? (
      <div className='applied-vacancies'>
        {
          candidates.map(c => (
          <div className='applied-vacancy' key={c._id}>
            <VacancyRow vacancy={c.vacancy} isHiddenVacancy={false} isSavedVacancy={false} />
            <div className="candidate-row">
              <div className="candidate-info">
                <div className="status">Статус: {statuses[c.status]}</div>
                {c.timestamp ? <div className="timestamp">Подана: {toCandidatekDate(c.timestamp)}</div> : null}
              </div>
              <div className="button-wrapper">
                <button className='button primary-button' onClick={() => removeCandidate(c._id)}>Видалити заявку</button>
              </div>
              </div>
          </div>
          ))
        }
      </div>
    ) : (
      <div>Ви ще не відгукнулися ні на одну вакансію</div>
    )
}
