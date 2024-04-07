import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context';
import { EmployerData, PaymentExpectations, SalaryChart, VacancyRow } from '../../components';
import { BACKEND } from '../../axios';
import { useNavigate } from 'react-router-dom';
import { ERROR_PAGE_URL } from '../../constants';
import { checkSimilarity } from '../../helpers';

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
    payment: '',
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
  const [similarVacancies, setSimilarVacancies] = useState([]);
  const [totalCandidates, setTotalCandidates] = useState(0);

  const payment = JSON.parse(vacancy.payment || `{ "type": "", "min": "0", "max": "0" }`);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const vacancyId = urlParams.get('vacancy_id');

    const currentVacancyText = (vacancy.name + vacancy.text).toLowerCase();

    try {
      BACKEND.post('/postedVacancies')
      .then((response) => {
        if(response.data.status === 'ok' && response.data.data && response.data.data.length) {
          const vacancies = response.data.data;

          const vacanciesToCheck = vacancies.filter(v => v._id !== vacancyId && v.status === 'active');

          const vacanciesWithSimilarity = vacanciesToCheck.map(v => ({ vacancy: v, similarity: checkSimilarity(currentVacancyText, (v.name + v.text).toLowerCase())}))
          
          vacanciesWithSimilarity.sort((a, b) => b.similarity - a.similarity);
          
          const vacanciesToShow = vacanciesWithSimilarity.slice(0, 3);

          setSimilarVacancies(vacanciesToShow);
        }
      });
    } catch(error) {
      console.log(error);
    }
  }, [vacancy]);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const vacancyId = urlParams.get('vacancy_id');

    const userId = CONTEXT.user._id;

    if(CONTEXT.user && CONTEXT.user._id) {
      try {
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
      } catch(error) {
        console.error(error)
      }

      try {
        BACKEND.post('/getAddedCVsById', { employee: CONTEXT.user._id }).then(response => {
          if(response.data.status === 'ok') {
            const CVs = response.data.data;
            setCVs(CVs);
            if(CVs.length) {
              setCandidate({...candidate, CV: CVs[0]._id});
            }
          }
        });
      } catch(error) {
        console.error(error);
      }

      try {
        BACKEND.post('/getPostedVacanciesById', { _id: CONTEXT.user._id }).then(response => {
          if(response.data.status === 'ok' && response.data.data) {
            const { candidates } = response.data.data;
  
            if(candidates && candidates.length) {
              setTotalCandidates(candidates.length);
            }
          }
        });
      } catch(error) {
        console.error(error)
      }
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

  const handleExpectationsChange = (event, type = null) => {
    let { name, value } = event.target;
    if(!!type) {
      value = value.replace(/[^0-9]/g, "");
    }
    setCandidate(prevProps => ({
      ...prevProps,
      expectations: { ...prevProps.expectations, [name]: value }
    }));
  }

  const findCVRoleById = (_id) => {
    if(!_id) return null;
    return CVs && CVs.length ? CVs.find(cv => cv._id === _id).CVData.role : null;
  }

  const handleCVChange = (event) => {
    const {value} = event.target;

    setCandidate({...candidate, CV: value});
  }

  const paymentTypes = {
    hourly: 'Ставка за годину',
    monthly: 'Оплата за місяць',
    once: 'Оплата за весь проєкт',
  };

  const isVacancyPayment = !!(payment && payment.min && payment.min !== 0 && payment.max !== 0);

  return (
    <div className="vacancy-page">
      <div className='vacancy'>
        <div className="name">{vacancy.name}</div>
        <div className="status">{vacancy.status}</div>
        { totalCandidates ? <div className='total-candidates'>Відгукнулися: {totalCandidates}</div> : null}
        <div className="tags">{vacancy.tags.map(tag => <div key={tag.id}>{tag.name}{tag.value ? `-${tag.value}` : ''}</div>)}</div>
        <div className="text">{vacancy.text}</div>
        <div className="testTaskLink">{vacancy.testTaskLink}</div>
        { isVacancyPayment ? <div className="payment">{paymentTypes[payment.type]}: {payment.min} - {payment.max}</div> : null }
      </div>
      <hr className='divider'/>
      {
        vacancy.employer && vacancy.employer.company ? (
          <EmployerData timeZone={vacancy.employer.timeZone} shortForm={false} company={JSON.parse(vacancy.employer.company)} employerId={vacancy.employer._id} />
        ) : null
      }
      {
        isVacancyPayment && payment.type !== 'once' ? (
          <SalaryChart payment={payment} name={vacancy.name}/>
        ) : null
      }
      {
        similarVacancies.length ? (
          <>
            <div className='similar'>
              <div>Схожі вакансії</div>
              { similarVacancies.map(sv => <VacancyRow vacancy={sv.vacancy} key={sv.vacancy._id} showEmployeeButtons={false}/>)}
            </div>
            <hr className='divider'/>
          </>
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
              <hr className='divider'/>
              <PaymentExpectations expectations={candidate.expectations} handleExpectationsChange={handleExpectationsChange} />
              <button type='submit' className='button primary-button'>Відгукнутися</button>
            </form>
          </div>
        ) : null
      }
      {
        !canBeCandidate ? 
        !vacancy.employer || vacancy.employer._id === CONTEXT.user._id ? 
        null : (
          <div className='already-candidate'>Ви вже подали заявку на цю вакансію</div>
        ) : null
      }
    </div>
  )
}
