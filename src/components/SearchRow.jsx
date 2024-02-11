import React from 'react'

export const SearchRow = ({query, onChange, onSubmit, onClear, type}) => {
  const label = type === 'employee' ? 'Знайти роботу' : 'Знайти робітника';

  return (
    <div className="searchRow">
      <div className="label">{label}</div>
      <input
        type="text"
        name="query"
        value={query}
        onChange={onChange}
      />
      <button className='button primary-button' onClick={onSubmit}>Знайти</button>
      <button className='button secondary-button' onClick={onClear}>Очистити</button>
    </div>
  )
}
