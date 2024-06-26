import React, { useContext, useEffect, useState } from 'react'
import { SearchFilters, SearchResults, SearchRow } from '../../components'
import { AppContext } from '../../context/context';
import { BACKEND } from '../../axios';
import { CV_CREATOR_URL, VACANCIES_SEARCH_RESULTS } from '../../constants';
import alertify from 'alertifyjs';
import { useNavigate } from 'react-router-dom';

export const EmployeeHome = () => {
  const navigate = useNavigate();
  const CONTEXT = useContext(AppContext);
  const [searchState, setSearchState] = useState({
    query: '',
    filters: {},
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
        if(response.data && response.data.status === 'ok' && response.data.data && response.data.data) {
          const vacancies = response.data.data;
          setVacancies(vacancies);
        } else {
          alertify.error('Не вдалося отримати вакансії');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося отримати вакансії');
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

    const results = vacancies
    .filter(
      v => v.employer._id !== CONTEXT.user._id && 
      v.name.toLowerCase().includes(searchState.query.toLowerCase()) &&
      v.status === 'active' &&
      (CONTEXT?.user?.hiddenVacancies ? !CONTEXT.user.hiddenVacancies.map(hv => hv._id).includes(v._id) : true)
    );
    
    if(keywords.length === 0) {
      setSearchState({...searchState, firstSearch: false, error: '', filters, results });
      return;
    }

    const vacanciesToShow = [];
    for(let vacancy of searchState.results) {
      const totalText = (vacancy.name + vacancy.tags.map(tag => tag) + vacancy.text).toLowerCase();
      const matchesCount = processedKeywords.filter(key => totalText.includes(key)).length;
      const percentage = matchesCount / keywords.length;

      if(percentage >= keywordsMatchLevel) vacanciesToShow.push(vacancy);
    }

    if(vacanciesToShow.length) {
      setSearchState({...searchState, firstSearch: false, error: '', filters, results: vacanciesToShow });
    } else {
      setSearchState({...searchState, error: 'За вашим запитом нічого не знайдено.' });
    }
  }

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if(!searchState.query) return;

    const filteredVacancies = vacancies
      .filter(
        v => v.employer._id !== CONTEXT.user._id && 
        v.name.toLowerCase().includes(searchState.query.toLowerCase()) &&
        v.status === 'active' &&
        (CONTEXT?.user?.hiddenVacancies ? !CONTEXT.user.hiddenVacancies.map(hv => hv._id).includes(v._id) : true)
      );
    if(filteredVacancies.length) {
      setSearchState({...searchState, firstSearch: false, error: '', results: filteredVacancies });
    } else {
      setSearchState({...searchState, error: 'За вашим запитом нічого не знайдено.' });
    }
    
  };

  const setVacancyToList = (listName, vacancyId) => {
    const update = (list) => {
      const updatedUser = { ...CONTEXT.user, [listName]: list };
      CONTEXT.updateState({ ...CONTEXT, user: updatedUser });

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

    let list = [...CONTEXT.user[listName]];

    if(list.find(v => v._id === vacancyId)) {
      list = list.filter(v => v._id !== vacancyId);
      update(list);
    } else {
      try {
        BACKEND.post('/getVacancyById', { _id: vacancyId }).then(response => {
          if(response.data && response.data.status === 'ok' && response.data.data) {
            const vacancy = response.data.data;
            list.push(vacancy);
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
    window.localStorage.removeItem(VACANCIES_SEARCH_RESULTS);
    setSearchState({
      query: '',
      filters: {},
      results: [],
      error: ''
    });
  }

  const saveToLocalStorage = () => {
    window.localStorage.setItem(VACANCIES_SEARCH_RESULTS, JSON.stringify(searchState));
  }
  
  const moveToCVCreator = id => {
    navigate(`${CV_CREATOR_URL}?CV_id=${id}`);
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

      { !searchState.error && !searchState.results.length ? (
        <div>Для початку роботи вкажіть посаду для пошуку у вакансії або <span onClick={() => moveToCVCreator('new')} className="toCreator">створіть резюме</span></div>
      ) : null }
    </div>
  )
}
