import React, { useContext, useEffect, useState } from 'react'
import { SearchEmployeeResults, SearchFilters, SearchRow } from '../../components'
import { AppContext } from '../../context/context';
import { BACKEND } from '../../axios';
import { EMPLOYEE_SEARCH_RESULTS } from '../../constants';

export const EmployerHome = () => {
  const CONTEXT = useContext(AppContext);
  const [searchState, setSearchState] = useState({
    query: '',
    filters: [],
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
        if(response.data.status === 'ok' && response.data.data && response.data.data.length) {
          const employees = response.data.data;
          setEmployees(employees);
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

    const filteredCVs = employees
      .filter(
        e => e.employee._id !== CONTEXT.user._id && 
        e.CVData.role.toLowerCase().includes(searchState.query.toLowerCase())
      );
    if(filteredCVs.length) {
      setSearchState({...searchState, firstSearch: false, error: '', results: filteredCVs });
    } else {
      setSearchState({...searchState, error: 'За вашим запитом нічого не знайдено.' });
    }
    
  };

  const setEmployeeToList = (listName, employeeId) => {
    let list = [...CONTEXT.user.savedUsers];

    if(list.find(e => e._id === employeeId)) {
      list = list.filter(e => e._id !== employeeId);
    } else {
      list.push(employeeId);
    }

    const updatedUser = { ...CONTEXT.user, [listName]: list };
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser });
 
    BACKEND.post('/updateUser', updatedUser).then(response => {
      console.log(response)
    });
  };

  const clearLocalStorage = () => {
    window.localStorage.removeItem(EMPLOYEE_SEARCH_RESULTS);
    setSearchState({
      query: '',
      filters: [],
      results: [],
      error: ''
    });
  }

  const saveToLocalStorage = () => {
    window.localStorage.setItem(EMPLOYEE_SEARCH_RESULTS, JSON.stringify(searchState));
  }

  return (
    <div className="search-page">
      <SearchRow query={searchState.query} onChange={handleInputChange} onSubmit={handleSearchSubmit} onClear={clearLocalStorage} />
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
    </div>
  )
}
