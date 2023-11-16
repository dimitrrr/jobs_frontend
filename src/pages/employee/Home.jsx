import React, { useContext, useEffect, useState } from 'react'
import { SearchFilters, SearchResults, SearchRow } from '../../components'
import { AppContext } from '../../context/context';
import { BACKEND } from '../../axios';

export const EmployeeHome = () => {
  const CONTEXT = useContext(AppContext);
  const [searchState, setSearchState] = useState({
    query: '',
    filters: [],
    results: CONTEXT.vacanciesSearchResults || [],
    firstSearch: CONTEXT.vacanciesSearchResults && CONTEXT.vacanciesSearchResults.length ? false : true,
    error: ''
  });
  const [vacancies, setVacancies] = useState([]);

  useEffect(() => {
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
      CONTEXT.updateState({...CONTEXT, vacanciesSearchResults: filteredVacancies});
      setSearchState({...searchState, firstSearch: false, error: '', results: filteredVacancies });
    } else {
      CONTEXT.updateState({...CONTEXT, vacanciesSearchResults: []});
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

  return (
    <div className="search-page">
      <SearchRow query={searchState.query} onChange={handleInputChange} onSubmit={handleSearchSubmit}/>
      { searchState.error ? <div className='error'>{searchState.error}</div> : (
        <>
          {
            !searchState.firstSearch ? (
              <div className='sidebar-page'>
                <aside>
                  <SearchFilters filters={searchState.filters} onChange={handleFiltersChange} />
                </aside>
                <article>
                  <SearchResults results={searchState.results} setVacancyToList={setVacancyToList} />
                </article>
              </div>
            ) : null
          }
        </>
      ) }
    </div>
  )
}
