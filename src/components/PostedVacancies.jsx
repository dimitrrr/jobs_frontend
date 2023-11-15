import React, { useContext } from 'react'
import { AppContext } from '../context/context';
import { VACANCY_CREATOR_URL } from '../constants';
import { useNavigate } from 'react-router-dom';
import { VacancyRow } from './VacancyRow';

export const PostedVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const navigate = useNavigate();

  const renderVacancies = () => {
    if(!CONTEXT || !CONTEXT.vacancies || !CONTEXT.vacancies.length) return <></>

    const employerVacancies = CONTEXT.vacancies.filter(v => v.employer._id === CONTEXT.user._id);

    return employerVacancies.map(v => <VacancyRow key={v._id} isForEmployer={true} vacancy={v}/>);
  }

  const moveToVacancyCreator = id => {
    navigate(`${VACANCY_CREATOR_URL}?vacancy_id=${id}`);
  }

  return (
    <div className='vacancies'>
      <button onClick={() => moveToVacancyCreator('new')}>Додати вакансію</button>
      <div className="posted">
        {renderVacancies()}
      </div>
    </div>
  )
}
