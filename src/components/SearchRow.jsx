import React from 'react'

export const SearchRow = ({query, onChange, onSubmit}) => {
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
    </div>
  )
}
