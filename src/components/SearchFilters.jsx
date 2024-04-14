import React, { useEffect, useState } from 'react'
import { List } from './List';

export const SearchFilters = ({ filters: initialFilters, onChange }) => {
  const [keywords, setKeywords] = useState([]);
  const [matchLevel, setMatchLevel] = useState(70);

  useEffect(() => {
    setKeywords(initialFilters.keywords || []);
  }, [initialFilters.keywords]);

  const onAfterKeywordsUpdate = (newKeywords) => {
    if(newKeywords) setKeywords(newKeywords);
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setMatchLevel(value);
  };

  const handleConfirm = () => {
    const newFilters = { ...initialFilters, keywords: keywords, keywordsMatchLevel: matchLevel / 100 };
    onChange(newFilters);
  }

  return (
    <div className='search-filters'>
      <label><h4>Ключові слова</h4></label>
      <div className="form-control">
        <label>Мінімум </label>
        <input
          className='level'
          type="text"
          name="matchLevel"
          value={matchLevel}
          onChange={handleInputChange}
        />
        <label>% наявності </label>
      </div>
      <List initialItems={keywords} onAfterUpdate={onAfterKeywordsUpdate} type='items' name='keywords' />
      <button style={{marginTop: '20px'}} className='button primary-button' onClick={() => handleConfirm()}>Оновити результати</button>
    </div>
  )
}
