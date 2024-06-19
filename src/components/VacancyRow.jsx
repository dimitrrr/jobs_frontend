import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { VACANCY_CREATOR_URL, VACANCY_URL } from '../constants';
import { AppContext } from '../context/context';
import { BACKEND } from '../axios';
import { CandidatesForVacancy } from './CandidatesForVacancy';
import alertify from 'alertifyjs';

export const VacancyRow = ({ vacancy, updateVacancyStatus, isForEmployer = false, setVacancyToList = null, isSavedVacancy = true, isHiddenVacancy = true, onMoveToVacancy = null, showEmployeeButtons = true }) => {
  const CONTEXT = useContext(AppContext);
  const [state, setState] = useState({
    isVacancySaved: CONTEXT.user.savedVacancies ? CONTEXT.user.savedVacancies.find(v => v._id === vacancy?._id) : false,
    isVacancyHidden: CONTEXT.user.savedVacancies ? CONTEXT.user.hiddenVacancies.find(v => v._id === vacancy?._id) : false,
    candidates: vacancy?.candidates || [],
    candidatesVisible: false,
    status: vacancy?.status || 'removed',
  });
  const navigate = useNavigate();

  const setStatus = (event) => {
    const { value: status } = event.target;
    setState({...state, status});
  }

  const setStatusForVacancy = (event, _id) => {
    event.preventDefault();

    const newVacancy = {...vacancy, status: state.status};

    try {
      BACKEND.post('/updateVacancy', newVacancy).then(response => {
        if(response.data && response.data.status === 'ok') {
          updateVacancyStatus(_id, newVacancy.status);
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

  const setCandidatesVisible = () => {
    setState({...state, candidatesVisible: !state.candidatesVisible});
  }

  const moveToVacancy = (id) => {
    if(onMoveToVacancy) onMoveToVacancy();
    navigate(`${VACANCY_URL}?vacancy_id=${id}`);
    window.location.reload();
    
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
    if(!vacancy || !vacancy.employer) return <></>

    const employer = vacancy.employer;
    let company = null;
    if(employer.company && employer.company.length) {
      try {
        company = JSON.parse(employer.company);
      } catch(error) {
        company = { name: 'Компанія' };
      }
    }
    const companyName = company ? company.name : employer.username;

    return (
      <div className="vacancy-row">
        <div className="name" onClick={() => moveToVacancy(vacancy._id)}>{vacancy.name}</div>
        <div className='status'>{companyName}</div>
        { 
        CONTEXT.user._id && showEmployeeButtons ? (
          <div className="buttons searchButtons">
            {
              isSavedVacancy ? (
                <button className='button secondary-button' onClick={() => updateVacancyIsSavedStatus(vacancy._id)}>{state.isVacancySaved ? 'Видалити зі збережених' : 'Зберегти'}</button>
              ) : null
            }
            {
              isHiddenVacancy ? (
                <button className='button secondary-button' onClick={() => updateVacancyIsHiddenStatus(vacancy._id)}>{state.isVacancyHidden ? 'Видалити із прихованих' : 'Приховати'}</button>
              ) : null
            }
          </div>
        ) : null
        }
      </div>
    );
  }

  const renderVacancyForEmployer = () => {
    if(!vacancy) return <></>

    const labelForVacancyStatus = {
      active: 'Відкрита',
      archived: 'Закрита',
      removed: 'Непотрібна',
    }

    return (
      <div>
        <div className="vacancy-row">
          <div className="name" onClick={() => moveToVacancy(vacancy._id)}>{vacancy.name}</div>
          <div className='status'>{labelForVacancyStatus[vacancy.status]}</div>
          <div className="buttons">
            <button className='button secondary-button' onClick={() => moveToVacancyCreator(vacancy._id)}>Редагувати</button>
          </div>
          <form onSubmit={(event) => setStatusForVacancy(event, vacancy._id)} className='select-and-button'>
            <select value={state.status} onChange={(event) => setStatus(event)}>
              <option value="active">Відкрита</option>
              <option value="archived">Закрита</option>
              <option value="removed">Непотрібна</option>
            </select>
            <button type='submit' className='button secondary-button'>Прийняти зміну</button>
          </form>
          <div className='candidates' onClick={() => setCandidatesVisible()}>Відгукнулися: {state.candidates.length} &#8595;</div>
        </div>
        { state.candidatesVisible ? <CandidatesForVacancy candidates={state.candidates}/> : null }
      </div>
    );
  }

  return isForEmployer ? renderVacancyForEmployer() : renderVacancyForEmployee();
}
