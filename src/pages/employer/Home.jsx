import React, { useContext, useEffect, useState } from 'react'
import { SearchEmployeeResults, SearchFilters, SearchRow } from '../../components'
import { AppContext } from '../../context/context';
import { BACKEND } from '../../axios';
import { EMPLOYEE_SEARCH_RESULTS, VACANCY_CREATOR_URL } from '../../constants';
import alertify from 'alertifyjs';
import { useNavigate } from 'react-router-dom';

export const EmployerHome = () => {
  const navigate = useNavigate();
  const CONTEXT = useContext(AppContext);
  const [searchState, setSearchState] = useState({
    query: '',
    filters: {},
    results: [],
    error: ''
  });
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const VSR = window.localStorage.getItem(EMPLOYEE_SEARCH_RESULTS);

    if(VSR) {
      setSearchState(JSON.parse(VSR));
    }

    try {
      BACKEND.post('/postedCVs')
      .then((response) => {
        if(response.data && response.data.status === 'ok' && response.data.data && response.data.data) {
          const employees = response.data.data;
          setEmployees(employees);
        } else {
          alertify.error('Не вдалося отримати резюме');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося отримати резюме');
      console.error(error);
    }
  }, []);

  const handleInputChange = (event) => {
    const { value } = event.target;
    setSearchState((prevProps) => ({
      ...prevProps,
      query: value
    }));
  };

  const handleFiltersChange = (filters) => {
    const { keywords, keywordsMatchLevel } = filters;

    const processedKeywords = keywords.map(kw => kw.name.toLowerCase());

    const results = employees
    .filter(
      e => e.employee._id !== CONTEXT.user._id && 
      e.CVData && e.CVData.role &&
      e.CVData.role.toLowerCase().includes(searchState.query.toLowerCase()) &&
      (e.visible == undefined || e.visible)
    );

    if(keywords.length === 0) {
      setSearchState({...searchState, firstSearch: false, error: '', filters, results });
      return;
    }

    const employeesToShow = [];
    for(let employee of results) {
      const totalText = JSON.stringify(employee.CVData || {}).toLowerCase();
      const matchesCount = processedKeywords.filter(key => totalText.includes(key)).length;
      const percentage = matchesCount / keywords.length;

      if(percentage >= keywordsMatchLevel) employeesToShow.push(employee);
    }

    if(employeesToShow.length) {
      setSearchState({...searchState, firstSearch: false, error: '', filters, results: employeesToShow });
    } else {
      setSearchState({...searchState, error: 'За вашим запитом нічого не знайдено.' });
    }
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if(!searchState.query) return;

    const filteredCVs = employees
      .filter(
        e => e.employee._id !== CONTEXT.user._id && 
        e.CVData && e.CVData.role &&
        e.CVData.role.toLowerCase().includes(searchState.query.toLowerCase()) &&
        (e.visible == undefined || e.visible)
      );
    if(filteredCVs.length) {
      setSearchState({...searchState, firstSearch: false, error: '', results: filteredCVs });
    } else {
      setSearchState({...searchState, error: 'За вашим запитом нічого не знайдено.' });
    }
    
  };

  const setEmployeeToList = (listName, employeeId) => {
    const update = (list) => {
      const updatedUser = { ...CONTEXT.user, savedUsers: list };
      CONTEXT.updateState({ ...CONTEXT, user: updatedUser});
  
      try {
        BACKEND.post('/updateUser', updatedUser).then(response => {
          if(response.data && response.data.status === 'ok') {
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

    let list = [...CONTEXT.user.savedUsers];

    if(list.find(e => e._id === employeeId)) {
      list = list.filter(e => e._id !== employeeId);
      update(list);
    } else {
      try {
        BACKEND.post('/getUserById', { _id: employeeId }).then(response => {
          if(response.data && response.data.status === 'ok' && response.data.data) {
            const employee = response.data.data;
            list.push(employee);
            update(list);
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
  };

  const clearLocalStorage = () => {
    window.localStorage.removeItem(EMPLOYEE_SEARCH_RESULTS);
    setSearchState({
      query: '',
      filters: {},
      results: [],
      error: ''
    });
  }

  const saveToLocalStorage = () => {
    window.localStorage.setItem(EMPLOYEE_SEARCH_RESULTS, JSON.stringify(searchState));
  }

  const moveToVacancyCreator = id => {
    navigate(`${VACANCY_CREATOR_URL}?vacancy_id=${id}`);
  }

  return (
    <div className="search-page">
      <SearchRow type='employer' query={searchState.query} onChange={handleInputChange} onSubmit={handleSearchSubmit} onClear={clearLocalStorage} />
      { searchState.error ? <div className='error'>{searchState.error}</div> : (
        <>
          {
            searchState.results.length ? (
              <div className='sidebar-page'>
                <aside>
                  <SearchFilters filters={searchState.filters} onChange={handleFiltersChange} />
                </aside>
                <article>
                  <SearchEmployeeResults results={searchState.results} setEmployeeToList={setEmployeeToList} onMoveToEmployee={saveToLocalStorage}/>
                </article>
              </div>
            ) : null
          }
        </>
      ) }


      { !searchState.error && !searchState.results.length ? (
        <div>Для початку роботи вкажіть посаду для пошуку серед робітників або <span onClick={() => moveToVacancyCreator('new')} className="toCreator">створіть вакансію</span></div>
      ) : null }
    </div>
  )
}
