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
      <button onClick={onSubmit}>Знайти</button>
      <button onClick={onClear}>Очистити</button>
    </div>
  )
}
