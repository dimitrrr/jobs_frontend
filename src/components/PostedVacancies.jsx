import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { VACANCY_CREATOR_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
import { VacancyRow } from './VacancyRow';
import { BACKEND } from '../axios';

export const PostedVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const navigate = useNavigate();
  const [postedVacancies, setPostedVacancies] = useState([]);

  useEffect(() => {
    if(CONTEXT.user && CONTEXT.user._id) {
      BACKEND.post('/getPostedVacanciesById', { _id: CONTEXT.user._id }).then(response => {
        if(response.data.status === 'ok' && response.data.data) {
          const { vacancies, candidates } = response.data.data;

          vacancies.forEach(v => {
            v.candidates = candidates.filter(c => c.vacancy._id === v._id);
          });

          setPostedVacancies(vacancies);
        }
      });
    }
  }, [CONTEXT.user._id]);

  const renderVacancies = () => {
    if(!postedVacancies || !postedVacancies.length) return <></>

    return postedVacancies.map(v => <VacancyRow key={v._id} isForEmployer={true} vacancy={v} updateVacancyStatus={updateVacancyStatus} />);
  }

  const updateVacancyStatus = (vacancyId, status) => {
    const updatedPostedVacancies = [...postedVacancies];

    updatedPostedVacancies.forEach(pv => {
      if(pv._id === vacancyId) {
        pv.status = status;
      }
    });

    setPostedVacancies(updatedPostedVacancies);
  }

  const moveToVacancyCreator = id => {
    navigate(`${VACANCY_CREATOR_URL}?vacancy_id=${id}`);
  }

  return (
    <div className='vacancies'>
      <button className='button primary-button' onClick={() => moveToVacancyCreator('new')}>Додати вакансію</button>
      <div className="posted-vacancies">
        {renderVacancies()}
      </div>
    </div>
  )
}
