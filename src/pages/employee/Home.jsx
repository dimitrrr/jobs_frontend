import React, { useContext, useEffect, useState } from 'react'
import { SearchFilters, SearchResults, SearchRow } from '../../components'
import { AppContext } from '../../context/context';
import { BACKEND } from '../../axios';
import { VACANCIES_SEARCH_RESULTS } from '../../constants';

export const EmployeeHome = () => {
  const CONTEXT = useContext(AppContext);
  const [searchState, setSearchState] = useState({
    query: '',
    filters: [],
    results: [],
    error: ''
  });
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
    const VSR = window.localStorage.getItem(VACANCIES_SEARCH_RESULTS);

    if(VSR) {
      setSearchState(JSON.parse(VSR));
    }

    try {
      BACKEND.post('/postedVacancies')
      .then((response) => {
        if(response.data.status === 'ok' && response.data.data && response.data.data.length) {
          const vacancies = response.data.data;
          setVacancies(vacancies);
        }
      });
    } catch(error) {
      console.log(error);
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
    console.log('change', filters)
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if(!searchState.query) return;

    const filteredVacancies = vacancies
      .filter(
        v => v.employer._id !== CONTEXT.user._id && 
        v.name.toLowerCase().includes(searchState.query.toLowerCase())
      );
    if(filteredVacancies.length) {
      setSearchState({...searchState, firstSearch: false, error: '', results: filteredVacancies });
    } else {
      setSearchState({...searchState, error: 'За вашим запитом нічого не знайдено.' });
    }
    
  };

  const setVacancyToList = (listName, vacancyId) => {
    let list = [...CONTEXT.user[listName]];

    if(list.find(v => v._id === vacancyId)) {
      list = list.filter(v => v._id !== vacancyId);
    } else {
      list.push(vacancyId);
    }

    const updatedUser = { ...CONTEXT.user, [listName]: list };
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser });
 
    BACKEND.post('/updateUser', updatedUser).then(response => {
      console.log(response)
    });
  };

  const clearLocalStorage = () => {
    window.localStorage.removeItem(VACANCIES_SEARCH_RESULTS);
    setSearchState({
      query: '',
      filters: [],
      results: [],
      error: ''
    });
  }

  const saveToLocalStorage = () => {
    window.localStorage.setItem(VACANCIES_SEARCH_RESULTS, JSON.stringify(searchState));
  }

  return (
    <div className="search-page">
      <SearchRow type='employee' query={searchState.query} onChange={handleInputChange} onSubmit={handleSearchSubmit} onClear={clearLocalStorage} />
      { searchState.error ? <div className='error'>{searchState.error}</div> : (
        <>
          {
            searchState.results.length ? (
              <div className='sidebar-page'>
                <aside>
                  <SearchFilters filters={searchState.filters} onChange={handleFiltersChange} />
                </aside>
                <article>
                  <SearchResults results={searchState.results} setVacancyToList={setVacancyToList} onMoveToVacancy={saveToLocalStorage}/>
                </article>
              </div>
            ) : null
          }
        </>
      ) }
    </div>
  )
}
