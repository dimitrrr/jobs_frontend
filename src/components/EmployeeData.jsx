import React from 'react'

export const EmployeeData = ({employee}) => {
  return (
    <div>
      <div>{employee.username}</div>
      <div>{employee.email}</div>
    </div>
  )
}
