import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context'
import { VacancyRow } from './VacancyRow';
import { BACKEND } from '../axios';

export const CandidateVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    BACKEND.post('/getCandidatesByEmployeeId', { _id: CONTEXT.user._id }).then(response => {
      if(response.data.status === 'ok' && response.data.data.length) {
        const currentUserVacancies = response.data.data;
        setCandidates(currentUserVacancies);
      }
    });

  }, [CONTEXT.user._id]);

  const removeCandidate = (_id) => {
    const newCandidates = candidates.filter(c => c._id !== _id);
    setCandidates(newCandidates);

    BACKEND.post('/removeCandidate', { _id }).then(response => {
      // console.log(response.data)
    });

  }

  return candidates.length ? (
      <div className='applied-vacancies'>
        {
          candidates.map(c => (
          <div className='applied-vacancy' key={c._id}>
            <VacancyRow vacancy={c.vacancy} isHiddenVacancy={false} isSavedVacancy={false} />
            <div className="status">Статус: {c.status}</div>
            <button className='button primary-button' onClick={() => removeCandidate(c._id)}>Видалити заявку</button>
          </div>
          ))
        }
      </div>
    ) : (
      <div>Ви ще не відгукнулися ні на одну вакансію</div>
    )
}
