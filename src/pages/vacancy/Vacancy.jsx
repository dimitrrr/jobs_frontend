import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context';
import { EmployerData } from '../../components';
import { BACKEND } from '../../axios';
import { useNavigate } from 'react-router-dom';
import { ERROR_PAGE_URL } from '../../constants';

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
    expectations: { type: 'hourly', min: 0, max: 0 },
    testTaskLink: '',
  });
  const [CVs, setCVs] = useState([]);
  const [canBeCandidate, setCanBeCandidate] = useState(false);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const vacancyId = urlParams.get('vacancy_id');

    const userId = CONTEXT.user._id;

    if(CONTEXT.user && CONTEXT.user._id) {
      BACKEND.post('/getVacancyAndCandidateById', { _id: vacancyId, userId }).then(response => {
        if(response.data.status === 'ok') {
          const { vacancy, candidate: can } = response.data.data;
          setVacancy(vacancy);
          setCandidate({...candidate, vacancy: vacancy._id, employee: userId});

          const cbc = !can && vacancy.employer._id !== CONTEXT.user._id; 
          setCanBeCandidate(cbc);
        } else {
          navigate(ERROR_PAGE_URL);
        }
      });

      BACKEND.post('/getAddedCVsById', { employee: CONTEXT.user._id }).then(response => {
        if(response.data.status === 'ok') {
          const CVs = response.data.data;
          setCVs(CVs);
          if(CVs.length) {
            setCandidate({...candidate, CV: CVs[0]._id});
          }
        }
      });
    }
  }, [CONTEXT.user._id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newCandidate = { ...candidate, expectations: JSON.stringify(candidate.expectations) };

    BACKEND.post('/addCandidate', newCandidate).then((response) => {
      if(response.data.status === 'ok') {
        setCandidate({...candidate, text: '', testTaskLink: '', expectations: { type: 'hourly', min: 0, max: 0 } });
        setCanBeCandidate(false);
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

  const findCVRoleById = (_id) => {
    if(!_id) return null;
    return CVs && CVs.length ? CVs.find(cv => cv._id === _id).CVData.role : null;
  }

  const handleCVChange = (event) => {
    const {value} = event.target;

    setCandidate({...candidate, CV: value});
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
          <EmployerData timeZone={vacancy.employer.timeZone} shortForm={true} company={JSON.parse(vacancy.employer.company)} employerId={vacancy.employer._id} />
        ) : null
      }
      {
        vacancy.status === 'active' && canBeCandidate ? (
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
              <div className="form-control">
                <label>Резюме</label>
                <select value={candidate.CV || ''} onChange={handleCVChange}>
                  {
                    CVs.map(cv => (
                      <option key={cv._id} value={cv._id}>{findCVRoleById(cv._id)}</option>
                    ))
                  }
                </select>
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
                  name='min' 
                  placeholder='Мінімальний очікуваний рівень оплати' 
                  value={candidate.expectations.min}
                  onChange={handleExpectationsChange}
                />-<input 
                type='text' 
                name='max' 
                placeholder='Максимальний очікуваний рівень оплати' 
                value={candidate.expectations.max}
                onChange={handleExpectationsChange}
              />
              </div>
              <button type='submit' className='button primary-button'>Відгукнутися</button>
            </form>
          </div>
        ) : null
      }
      {
        !canBeCandidate ? 
        !vacancy.employer || vacancy.employer._id === CONTEXT.user._id ? 
        null : (
          <div>Ви вже подали заявку на цю вакансію</div>
        ) : null
      }
    </div>
  )
}
