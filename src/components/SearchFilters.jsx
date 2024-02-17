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
    <div>
      <div>
        <label>Ключові слова</label>
        <div className="form-control">
          <label>Мінімальний % наявності</label>
          <input
            type="text"
            name="matchLevel"
            value={matchLevel}
            onChange={handleInputChange}
          />
        </div>
        <List initialItems={keywords} onAfterUpdate={onAfterKeywordsUpdate} type='items' name='keywords' />
        <button className='button primary-button' onClick={() => handleConfirm()}>Знайти</button>
      </div>
    </div>
  )
}
