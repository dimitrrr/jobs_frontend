import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context';
import { CandidatesChart, EmployerData, PaymentExpectations, SalaryChart, VacancyDateChart, VacancyRow } from '../../components';
import { BACKEND } from '../../axios';
import { useNavigate } from 'react-router-dom';
import { ERROR_PAGE_URL } from '../../constants';
import { checkSimilarity } from '../../helpers';
import alertify from 'alertifyjs';

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
  const [allVacancies, setAllVacancies] = useState([]);
  const [allCandidates, setAllCandidates] = useState([]);
  const [allCandidatesForVacancy, setAllCandidatesForVacancy] = useState([]);

  const payment = JSON.parse(vacancy.payment || `{ "type": "", "min": "0", "max": "0" }`);

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const vacancyId = urlParams.get('vacancy_id');

    const currentVacancyText = (vacancy.name + vacancy.text).toLowerCase();

    try {
      BACKEND.post('/postedVacancies')
      .then((response) => {
        if(response.data && response.data.status === 'ok' && response.data.data && response.data.data) {
          const vacancies = response.data.data;

          const vacanciesToCheck = vacancies.filter(v => v._id !== vacancyId && v.status === 'active');

          const vacanciesWithSimilarity = vacanciesToCheck.map(v => ({ vacancy: v, similarity: checkSimilarity(currentVacancyText, (v.name + v.text).toLowerCase())}))
          
          vacanciesWithSimilarity.sort((a, b) => b.similarity - a.similarity);
          
          const vacanciesToShow = vacanciesWithSimilarity.slice(0, 3);

          setSimilarVacancies(vacanciesToShow);
          setAllVacancies(vacancies);
        } else {
          alertify.error('Не вдалося отримати вакансії');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося отримати вакансії');
      console.error(error);
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
          if(response.data && response.data.status === 'ok') {
            const { vacancy, candidate: can } = response.data.data;
            setVacancy(vacancy);

            const newCandidate = { ...candidate, vacancy: vacancy._id, employee: userId };
            if(vacancy.payment && vacancy.payment.length) {
              const payment = JSON.parse(vacancy.payment);
              
              const expectations = { ...payment };

              newCandidate.expectations = expectations;
            }

            setCandidate(newCandidate);
  
            const cbc = !can && vacancy.employer._id !== CONTEXT.user._id; 
            setCanBeCandidate(cbc);
          } else {
            navigate(ERROR_PAGE_URL);
            alertify.error('Не вдалося отримати вакансію');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося отримати вакансію');
        console.error(error);
      }

      try {
        BACKEND.post('/getAddedCVsById', { employee: CONTEXT.user._id }).then(response => {
          if(response.data && response.data.status === 'ok') {
            const CVs = response.data.data;
            setCVs(CVs);
            if(CVs.length) {
              setCandidate({...candidate, CV: CVs[0]._id});
            }
          } else {
            alertify.error('Не вдалося отримати резюме');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося отримати резюме');
        console.error(error);
      }

      try {
        BACKEND.post('/getPostedVacanciesById', { _id: CONTEXT.user._id }).then(response => {
          if(response.data && response.data.status === 'ok' && response.data.data) {
            const { candidates } = response.data.data;
  
            if(candidates && candidates.length) {
              const candidatesForVacancy = candidates.filter(c => c.vacancy._id === vacancyId);
              setAllCandidatesForVacancy(candidatesForVacancy);
              setAllCandidates(candidates);
            }
          } else {
            alertify.error('Не вдалося отримати кількість кандидатів');
            console.error(response);
          }
        });
      } catch(error) {
        alertify.error('Не вдалося отримати кількість кандидатів');
        console.error(error);
      }
    } else {
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
  }, [CONTEXT.user._id]);

  const handleSubmit = (event) => {
    event.preventDefault();

    const newCandidate = { ...candidate, expectations: JSON.stringify(candidate.expectations), timestamp: Date.now() };

    try {
      BACKEND.post('/addCandidate', newCandidate).then((response) => {
        if(response.data && response.data.status === 'ok') {
          setCandidate({...candidate, text: '', testTaskLink: '', expectations: { type: 'hourly', min: 0, max: 0 } });
          setCanBeCandidate(false);
        } else {
          alertify.error('Не вдалося створити заявку');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося створити заявку');
      console.error(error);
    }
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
    if(!_id || !CVs || !CVs.length) return null;
    const CV = CVs.find(cv => cv._id === _id);
    return CV && CV.CVData ? CV.CVData.role : null;
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

  const isVacancyPayment = !!(payment && payment.min && payment.min != 0 && payment.max != 0);

  let canBeCandidateTitle = null;
  if(!canBeCandidate) {
    if(!vacancy.employer || vacancy.employer._id === CONTEXT.user._id) canBeCandidateTitle = 'Ви не можете подати заявку на цю вакансію';
    else if(candidate && candidate.employee) canBeCandidateTitle = 'Ви вже подали заявку на цю вакансію';
    else canBeCandidateTitle = 'Ви не можете подати заявку на цю вакансію';
  }

  return (
    <div className="vacancy-page">
      <div className='vacancy'>
        <div className="name">{vacancy.name}</div>
        <div className="status">{vacancy.status}</div>
        { allCandidatesForVacancy ? <div className='total-candidates'>Відгукнулися: {allCandidatesForVacancy.length}</div> : null}
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
      <div className="charts">
        {
          isVacancyPayment && payment.type !== 'once' ? (
            <SalaryChart payment={payment} name={vacancy.name}/>
          ) : null
        }
        { allCandidates && allCandidates.length ? (
          <CandidatesChart candidates={allCandidates} name={vacancy.name} /> 
        ) : null
        }
        { allVacancies && allVacancies.length ? (
          <VacancyDateChart vacancies={allVacancies} name={vacancy.name} /> 
        ) : null
        }
      </div>
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
        !canBeCandidate ? (
          <div className='already-candidate'>{canBeCandidateTitle}</div>
        ) : null
      }
    </div>
  )
}
