import React from 'react'

export const EmployeeData = ({employee}) => {
  return (
    <div className='employee-page'>
      <div>{employee.username}</div>
      <div>{employee.email}</div>
    </div>
  )
}
