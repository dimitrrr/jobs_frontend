import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { VACANCY_CREATOR_URL, VACANCY_URL } from '../constants';
import { AppContext } from '../context/context';
import { BACKEND } from '../axios';

export const VacancyRow = ({ vacancy, isForEmployer = false, setVacancyToList = null, isSavedVacancy = true, isHiddenVacancy = true }) => {
  const CONTEXT = useContext(AppContext);
  const [state, setState] = useState({
    isVacancySaved: CONTEXT.user.savedVacancies ? CONTEXT.user.savedVacancies.find(v => v._id === vacancy._id) : false,
    isVacancyHidden: CONTEXT.user.savedVacancies ? CONTEXT.user.hiddenVacancies.find(v => v._id === vacancy._id) : false,
  });
  const navigate = useNavigate();

  const setStatusForVacancy = (_id, status) => {
    const vacancy = CONTEXT.vacancies.find(v => v._id === _id);
    const newVacancy = {...vacancy, status};

    const newVacancies = CONTEXT.vacancies.filter(v => v._id !== _id);
    newVacancies.push(newVacancy);

    try {
      BACKEND.post('/updateVacancy', newVacancy).then(response => {
        CONTEXT.updateState({...CONTEXT, vacancies: newVacancies, lastUpdateTime: Date.now()});
      });
    } catch(error) {
      console.log(error);
    }

  }

  const moveToVacancy = (id) => {
    navigate(`${VACANCY_URL}?vacancy_id=${id}`);
  }

  const moveToVacancyCreator = (id) => {
    navigate(`${VACANCY_CREATOR_URL}?vacancy_id=${id}`);
  }

  const updateVacancyIsSavedStatus = (vacancyId) => {
    setState({...state, isVacancySaved: !state.isVacancySaved});
    setVacancyToList('savedVacancies', vacancyId);
  }

  const updateVacancyIsHiddenStatus = (vacancyId) => {
    setState({...state, isVacancyHidden: !state.isVacancyHidden});
    setVacancyToList('hiddenVacancies', vacancyId);
  }

  const renderVacancyForEmployee = () => {

    return (
      <div className="vacancy">
        <div className="name" onClick={() => moveToVacancy(vacancy._id)}>{vacancy.name}</div>
        <div className='status'>{vacancy.status}</div>
        { 
        CONTEXT.user._id ? (
          <div className="buttons">
            {
              isSavedVacancy ? (
                <button type='button' onClick={() => updateVacancyIsSavedStatus(vacancy._id)}>{state.isVacancySaved ? 'Видалити зі збережених' : 'Зберегти'}</button>
              ) : null
            }
            {
              isHiddenVacancy ? (
                <button type='button' onClick={() => updateVacancyIsHiddenStatus(vacancy._id)}>{state.isVacancyHidden ? 'Видалити із прихованих' : 'Приховати'}</button>
              ) : null
            }
          </div>
        ) : null
        }
      </div>
    );
  }

  const renderVacancyForEmployer = () => {
    return (
      <div className="vacancy">
        <div className="name" onClick={() => moveToVacancy(vacancy._id)}>{vacancy.name}</div>
        <div className='status'>{vacancy.status}</div>
        <div className="buttons">
         <button type='button' onClick={() => moveToVacancyCreator(vacancy._id)}>Редагувати</button>
          { vacancy.status !== 'active' ? <button type='button' onClick={() => setStatusForVacancy(vacancy._id, 'active')}>Позначити як відкриту</button> : null }
          { vacancy.status !== 'archived' ? <button type='button' onClick={() => setStatusForVacancy(vacancy._id, 'archived')}>Позначити як закриту</button> : null }
          { vacancy.status !== 'removed' ? <button type='button' onClick={() => setStatusForVacancy(vacancy._id, 'removed')}>Позначити як непотрібну</button> : null }
        </div>
      </div>
    );
  }

  return isForEmployer ? renderVacancyForEmployer() : renderVacancyForEmployee();
}
