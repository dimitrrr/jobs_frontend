import React, { useContext } from 'react'
import { AppContext } from '../context/context';
import { VACANCY_CREATOR_URL } from '../constants';
import { useNavigate } from 'react-router-dom';

export const PostedVacancies = () => {
  const CONTEXT = useContext(AppContext);
  const navigate = useNavigate();

  const renderVacancies = () => {
    if(!CONTEXT || !CONTEXT.vacancies || !CONTEXT.vacancies.length) return <></>

    return CONTEXT.vacancies.map(v => (
      <div className="vacancy" key={v._id}>
        <div className="name">{v.name}</div>
        <div className='status'>{v.status}</div>
        <button type='button' onClick={() => moveToVacancyCreator(v._id)}>Редагувати</button>
        <button type='button'>Позначити як закриту</button>
        <button type='button'>Позначити як непотрібну</button>
      </div>
    ));
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
