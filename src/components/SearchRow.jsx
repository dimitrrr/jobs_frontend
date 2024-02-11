import React from 'react'

export const SearchRow = ({query, onChange, onSubmit, onClear}) => {
  return (
    <div className="searchRow">
      <div className="label">Знайти роботу</div>
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
