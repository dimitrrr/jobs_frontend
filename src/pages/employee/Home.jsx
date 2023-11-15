import React, { useContext, useState } from 'react'
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
    
    if(!searchState.results.length && (!CONTEXT || !CONTEXT.vacancies || !CONTEXT.vacancies.length)) {
      const userId = CONTEXT && CONTEXT.user && CONTEXT.user._id ? CONTEXT.user._id : null;
      BACKEND.post('/searchVacanciesByName', { name: searchState.query, userId })
      .then((response) => {
        if(response.data.status === 'ok') {
          if(response.data.data.length) {
            CONTEXT.updateState({...CONTEXT, vacanciesSearchResults: response.data.data, lastUpdateTime: Date.now()});
            setSearchState({...searchState, firstSearch: false, error: '', results: response.data.data });
          } else {
            CONTEXT.updateState({...CONTEXT, vacanciesSearchResults: [], lastUpdateTime: Date.now()});
            setSearchState({...searchState, error: 'За вашим запитом нічого не знайдено.' });
          }
        } else {
          console.log(response.data.data)
        }
      }); 
    } else {
      const filteredVacancies = CONTEXT.vacancies
        .filter(
          v => v.employer._id !== CONTEXT.user._id && 
          v.name.toLowerCase().includes(searchState.query.toLowerCase())
        );
      if(filteredVacancies.length) {
        CONTEXT.updateState({...CONTEXT, vacanciesSearchResults: filteredVacancies, lastUpdateTime: Date.now()});
        setSearchState({...searchState, firstSearch: false, error: '', results: filteredVacancies });
      } else {
        CONTEXT.updateState({...CONTEXT, vacanciesSearchResults: [], lastUpdateTime: Date.now()});
        setSearchState({...searchState, error: 'За вашим запитом нічого не знайдено.' });
      }
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
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser, lastUpdateTime: Date.now() });
 
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
