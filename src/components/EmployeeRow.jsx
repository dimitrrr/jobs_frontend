import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { EMPLOYEE_PROFILE_PAGE_URL } from '../constants';
import alertify from 'alertifyjs';
import { savePdf } from '../helpers';

export const EmployeeRow = ({CV, onMoveToEmployee = null, setEmployeeToList, hideCV = false}) => {
  const CONTEXT = useContext(AppContext);
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if(CONTEXT.user && CONTEXT.user.savedUsers && CONTEXT.user.savedUsers.length) {
      const savedUser = CONTEXT.user.savedUsers.includes(CV.employee._id) || CONTEXT.user.savedUsers.find(su => su._id === CV.employee._id);
      setIsSaved(!!savedUser);
    }
  }, [CONTEXT.user]);

  const getTimeOffset = () => {
    if(!CONTEXT.user || !CONTEXT.user.timeZone || !CV || !CV.employee || !CV.employee.timeZone) return 0;

    const firstUserTime = JSON.parse(CONTEXT.user.timeZone);
    const secondUserTime = JSON.parse(CV.employee.timeZone);

    if(firstUserTime && firstUserTime.offset && secondUserTime && secondUserTime.offset) {
      return firstUserTime.offset - secondUserTime.offset;
    }

    return 0;
  }

  const downloadCV = () => {
    if(!CV._id || !CV.file || !CV.file.data) {
      alertify.error('Не вдалося знайти резюме');
      return;
    }

    savePdf(CV.file.data);
  }

  const moveToEmployeePage = () => {
    if(onMoveToEmployee) onMoveToEmployee();
    navigate(`${EMPLOYEE_PROFILE_PAGE_URL}?employee_id=${CV.employee._id}`);
  }

  const updateEmployeeIsSavedStatus = (employeeId) => {
    setIsSaved(!isSaved);
    setEmployeeToList('savedUsers', employeeId);
  }

  return (
    <div className='employee-item'>
      <div>
        <div onClick={moveToEmployeePage}>{CV.employee.username}</div>
        <div>{CV.employee.email}</div>
        <div className='time-offset'>Різниця в часі: {getTimeOffset()} год</div>
      </div>
        { !hideCV ? (
          <div className='download-cv' onClick={downloadCV}>Завантажити резюме</div>
        ) : null }
      <div className='buttons searchButtons'>
        <button className='button primary-button' onClick={() => updateEmployeeIsSavedStatus(CV.employee._id)}>{isSaved ? 'Видалити зі збережених' : 'Зберегти'}</button>
      </div>
    </div>
  )
}
