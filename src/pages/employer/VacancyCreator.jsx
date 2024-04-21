import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context';
import { EMPLOYER_PERSONAL_URL, ERROR_PAGE_URL } from '../../constants';
import { BACKEND } from '../../axios';
import { useNavigate } from 'react-router-dom';
import { List, PaymentExpectations } from '../../components';
import alertify from 'alertifyjs';

export const VacancyCreator = () => {
  const navigate = useNavigate();
  const CONTEXT = useContext(AppContext);
  const [vacancy, setVacancy] = useState({
    name: '',
    text: '',
    status: '',
    tags: [],
    testTaskLink: '',
    payment: { type: 'hourly', min: 0, max: 0 },
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const vacancyId = urlParams.get('vacancy_id');

  const isNewVacancy = vacancyId === 'new';

  useEffect(() => {
    if(!isNewVacancy) {
      try {
        BACKEND.post('/getVacancyById', { _id: vacancyId }).then(response => {
          if(response.data && response.data.status === 'ok' && response.data.data) {
            const vacancy = response.data.data;
            setVacancy(vacancy);
          } else {
            navigate(ERROR_PAGE_URL);
            alertify.error('Не вдалося отримати вакансію');
            console.error(response);
          }
        })
      } catch(error) {
        alertify.error('Не вдалося отримати вакансію');
        console.error(error);
      }
    }
  }, [vacancyId]);

  const handlePaymentChange = (event, type = null) => {
    let { name, value } = event.target;
    if(!!type) {
      value = value.replace(/[^0-9]/g, "");
    }
    setVacancy(prevProps => ({
      ...prevProps,
      payment: { ...prevProps.payment, [name]: value }
    }));
  }

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
      payment: JSON.stringify(vacancy.payment),
    };

    if(isNewVacancy) {
      try {
        BACKEND.post('/createVacancy', newVacancy).then(response => {
          if(response.data && response.data.status === 'ok') {
            navigate(EMPLOYER_PERSONAL_URL);
          } else {
            alertify.error('Не вдалося створити вакансію');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося створити вакансію');
        console.error(error);
      }
    } else {

      try {
        BACKEND.post('/updateVacancy', newVacancy).then(response => {
          if(response.data && response.data.status === 'ok') {
            navigate(EMPLOYER_PERSONAL_URL);
          } else {
            alertify.error('Не вдалося оновити вакансію');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося оновити вакансію');
        console.error(error);
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
        if(response.data && response.data.status === 'ok') {
          setVacancy(newVacancy);
        } else {
          alertify.error('Не вдалося оновити вакансію');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося оновити вакансію');
      console.error(error);
    }

  }

  const onAfterTagsUpdate = (tags) => {
    const newVacancy = { ...vacancy, tags };
    setVacancy(newVacancy);
  };

  return (
    <div className='createVacancy'>
      <div className='creator-header header'>{isNewVacancy ? 'Створити' : 'Редагувати'} вакансію</div>
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
          <div className="form-control">
            <label className='header'>Додайте кілька тегів, щоб зробити вакансію більш інформативною (наприклад, "Для студентів" або "Для ветеранів")</label>
            <List initialItems={vacancy.tags} onAfterUpdate={onAfterTagsUpdate} type='items' name='tags' />
          </div>
          { !isNewVacancy ? <div className="status">Статус: {vacancy.status}</div> : null }
          <PaymentExpectations expectations={vacancy.payment} handleExpectationsChange={handlePaymentChange} />
          <div className="form-control">
            <label className='header'>Опис</label>
            <textarea
              type="text"
              name="text"
              value={vacancy.text}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-control">
            <label className='header'>Посилання на тестове завдання (не обовʼязково)</label>
            <input
              type="text"
              name="testTaskLink"
              value={vacancy.testTaskLink}
              onChange={handleInputChange}
            />
          </div>
          <div className="buttons">
            <button type='submit' className='button primary-button'>{isNewVacancy ? 'Створити' : 'Зберегти'}</button>
            <button className='button secondary-button' onClick={returnToPersonal}>Скасувати</button>
          </div>
          {!isNewVacancy ? (
            <div className='additional-buttons'>
              {
                vacancy.status !== 'active' ? (
                  <div className="form-control">
                    <label></label>
                    <button className='button secondary-button' onClick={() => setStatusForVacancy('active')}>Позначити як відкриту</button>
                  </div>
                ) : null
              }
              {
                vacancy.status !== 'archived' ? (
                  <div className="form-control">
                    <label></label>
                    <button className='button secondary-button' onClick={() => setStatusForVacancy('archived')}>Позначити як закриту</button>
                  </div>
                ) : null
              }
              {
                vacancy.status !== 'removed' ? (
                  <div className="form-control">
                    <label></label>
                    <button className='button secondary-button' onClick={() => setStatusForVacancy('removed')}>Позначити як непотрібну</button>
                  </div>
                ) : null
              }
            </div>
          ) : null}
      </form>
    </div>
  )
}
