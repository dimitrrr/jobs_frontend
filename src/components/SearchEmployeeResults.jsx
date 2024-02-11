import React from 'react'
import { EmployeeRow } from './EmployeeRow';

export const SearchEmployeeResults = ({results, onMoveToEmployee, setEmployeeToList}) => {
  return (
    <div className='searched-employees'>
      {results.map(r => (
        <EmployeeRow 
          key={r._id}
          CV={r}
          onMoveToEmployee={onMoveToEmployee}
          setEmployeeToList={setEmployeeToList}
        />))
      }
    </div>
  )
}
