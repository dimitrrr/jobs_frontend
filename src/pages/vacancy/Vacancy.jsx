import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context';
import { useNavigate } from 'react-router-dom';
import { EmployerData } from '../../components';
import { BACKEND } from '../../axios';

export const Vacancy = () => {
  const navigate = useNavigate();
  const CONTEXT = useContext(AppContext);
  const [vacancy, setVacancy] = useState({
    name: '',
    text: '',
    status: '',
    tags: [],
    testTaskLink: '',
    employer: null,
  });
  const [candidate, setCandidate] = useState({
    employee: null,
    vacancy: null,
    CV: null,
    text: '',
    expectations: { type: 'hourly', value: '' },
    testTaskLink: '',
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const vacancyId = urlParams.get('vacancy_id');

  useEffect(() => {
    const vacancy = CONTEXT.vacancies.find(v => v._id === vacancyId);

    if(vacancy) {
      setVacancy(vacancy);
      setCandidate({...candidate, vacancy: vacancy._id, employee: CONTEXT.user._id});
    }
  }, [CONTEXT.vacancies, vacancyId, navigate, CONTEXT.user._id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newCandidate = { ...candidate, expectations: JSON.stringify(candidate.expectations) };

    BACKEND.post('/addCandidate', newCandidate).then((response) => {
      console.log(response)
      if(response.data.status === 'Ok') {
        alert('candidate');
      }
    })
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCandidate((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handleExpectationsChange = (event) => {
    const { name, value } = event.target;
    setCandidate(prevProps => ({
      ...prevProps,
      expectations: { ...prevProps.expectations, [name]: value }
    }))
  }

  return (
    <div className="vacancy-page">
      <div className='vacancy'>
        <div className="name">{vacancy.name}</div>
        <div className="status">{vacancy.status}</div>
        <div className="tags">{vacancy.tags}</div>
        <div className="text">{vacancy.text}</div>
        <div className="testTaskLink">{vacancy.testTaskLink}</div>
      </div>
      {
        vacancy.employer && vacancy.employer.company ? (
          <EmployerData shortForm={true} company={JSON.parse(vacancy.employer.company)} employerId={vacancy.employer._id} />
        ) : null
      }
      {
        vacancy.status === 'active' ? (
          <div className="candidate">
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label>Повідомлення (мотиваційна частина)</label>
                <textarea
                  type="text"
                  name="text"
                  value={candidate.text}
                  onChange={handleInputChange}
                />
              </div>
              { vacancy.testTaskLink ? (
              <div className="form-control">
                <label>Посилання на виконане тестове завдання</label>
                <input
                  type="text"
                  name="testTaskLink"
                  value={candidate.testTaskLink}
                  onChange={handleInputChange}
                />
              </div>
              ) : null}
              <div className="form-control">
                Вкажіть очікуваний тип та рівень оплати
                <div className="radio">
                  <label>
                    <input 
                      type="radio" 
                      value="hourly"
                      name='type'
                      checked={candidate.expectations.type === 'hourly'} 
                      onChange={handleExpectationsChange}
                    />
                    Ставка за годину
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input 
                      type="radio" 
                      name='type'
                      value="monthly" 
                      checked={candidate.expectations.type === 'monthly'} 
                      onChange={handleExpectationsChange}
                    />
                    Оплата за місяць
                  </label>
                </div>
                <div className="radio">
                  <label>
                    <input 
                      name='type'
                      type="radio" 
                      value="once" 
                      checked={candidate.expectations.type === 'once'} 
                      onChange={handleExpectationsChange}
                    />
                    Оплата за весь проєкт
                  </label>
                </div>
                <input 
                  type='text' 
                  name='value' 
                  placeholder='Очікуваний рівень оплати' 
                  value={candidate.expectations.value}
                  onChange={handleExpectationsChange}
                />
              </div>
              <button type='submit'>Відгукнутися</button>
            </form>
          </div>
        ) : null
      }
    </div>
  )
}
