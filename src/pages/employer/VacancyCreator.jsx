import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context';
import { EMPLOYER_PERSONAL_URL, ERROR_PAGE_URL } from '../../constants';
import { BACKEND } from '../../axios';
import { useNavigate } from 'react-router-dom';

export const VacancyCreator = () => {
  const navigate = useNavigate();
  const CONTEXT = useContext(AppContext);
  const [vacancy, setVacancy] = useState({
    name: '',
    text: '',
    status: '',
    tags: [],
    testTaskLink: '',
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const vacancyId = urlParams.get('vacancy_id');

  const isNewVacancy = vacancyId === 'new';

  useEffect(() => {
    if(!isNewVacancy) {
      BACKEND.post('/getVacancyById', { _id: vacancyId }).then(response => {
        if(response.data.status === 'ok' && response.data.data) {
          const vacancy = response.data.data;
          setVacancy(vacancy);
        } else {
          navigate(ERROR_PAGE_URL);
        }
      })
    }
  }, [vacancyId]);


  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setVacancy((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newVacancy = {
      ...vacancy,
      employer: CONTEXT.user._id,
    };

    if(isNewVacancy) {
      try {
        BACKEND.post('/createVacancy', newVacancy).then(response => {
          navigate(EMPLOYER_PERSONAL_URL);
        });
      } catch(error) {
        console.log(error);
      }
    } else {

      try {
        BACKEND.post('/updateVacancy', newVacancy).then(response => {
          navigate(EMPLOYER_PERSONAL_URL);
        });
      } catch(error) {
        console.log(error);
      }

    }
  };

  const returnToPersonal = () => {
    navigate(EMPLOYER_PERSONAL_URL);
  }

  const setStatusForVacancy = status => {
    const newVacancy = {...vacancy, status};

    try {
      BACKEND.post('/updateVacancy', newVacancy).then(response => {
        setVacancy(newVacancy);
        // navigate(EMPLOYER_PERSONAL_URL);
      });
    } catch(error) {
      console.log(error);
    }

  }

  return (
    <div className='createVacancy'>
      <div>{isNewVacancy ? 'Створити' : 'Редагувати'} вакансію</div>
      <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label>Назва</label>
            <input
              type="text"
              name="name"
              value={vacancy.name}
              onChange={handleInputChange}
            />
          </div>
          { !isNewVacancy ? <div className="status">Статус: {vacancy.status}</div> : null }
          <div className="form-control">
            <label>Опис</label>
            <textarea
              type="text"
              name="text"
              value={vacancy.text}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label>Посилання на тестове завдання (не обовʼязково)</label>
            <input
              type="text"
              name="testTaskLink"
              value={vacancy.testTaskLink}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label></label>
            <div className='button primary-button'>{isNewVacancy ? 'Створити' : 'Зберегти'}</div>
          </div>
          <div className="form-control">
            <label></label>
            <div className='button secondary-button' onClick={returnToPersonal}>Скасувати</div>
          </div>
          {!isNewVacancy ? (
            <>
              {
                vacancy.status !== 'active' ? (
                  <div className="form-control">
                    <label></label>
                    <div className='button secondary-button' onClick={() => setStatusForVacancy('active')}>Позначити як відкриту</div>
                  </div>
                ) : null
              }
              {
                vacancy.status !== 'archived' ? (
                  <div className="form-control">
                    <label></label>
                    <div className='button secondary-button' onClick={() => setStatusForVacancy('archived')}>Позначити як закриту</div>
                  </div>
                ) : null
              }
              {
                vacancy.status !== 'removed' ? (
                  <div className="form-control">
                    <label></label>
                    <div className='button secondary-button' onClick={() => setStatusForVacancy('removed')}>Позначити як непотрібну</div>
                  </div>
                ) : null
              }
            </>
          ) : null}
      </form>
    </div>
  )
}
