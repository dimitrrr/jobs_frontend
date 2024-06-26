import React, { useContext, useEffect, useState } from 'react'
import { BACKEND } from '../axios';
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { EMPLOYEE_PROFILE_PAGE_URL } from '../constants';
import alertify from 'alertifyjs';
import { savePdf } from '../helpers';

const possibleStatusValues = ['pending', 'accepted', 'denied'];

export const Candidate = ({candidate}) => {
  const CONTEXT = useContext(AppContext);
  const navigate = useNavigate(AppContext);
  const [candidateStatus, setCandidateStatus] = useState(candidate.status);
  const [color, setColor] = useState('#ffffff');

  const expectations = JSON.parse(candidate.expectations || `{ "type": "", "min": "0", "max": "0" }`);

  useEffect(() => {
    const color = getColorByStatus(candidate.status);
    setColor(color);
  }, [candidate.status]);

  const getColorByStatus = (status) => {
    return status === 'accepted' ? '#90EE90' : status === 'denied' ? '#EE4B2B' : '#ffffff';
  }

  const handleStatusChange = (event) => {
    const { value } = event.target;

    if(value !== candidateStatus && possibleStatusValues.includes(value)) {
      setCandidateStatus(value);
    }
  }

  const updateCandidateStatus = (event) => {
    event.preventDefault();

    const newCandidate = { ...candidate, status: candidateStatus };

    try {
      BACKEND.post('/updateCandidate', newCandidate).then(response => {
        if(response.data && response.data.status === 'ok') {
          setColor(getColorByStatus(candidateStatus));
        } else {
          alertify.error('Не вдалося змінити статус');
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error('Не вдалося змінити статус');
      console.error(error);
    }

  }

  const moveToEmployeePage = () => {
    navigate(`${EMPLOYEE_PROFILE_PAGE_URL}?employee_id=${candidate.employee._id}`);
  }

  const getTimeOffset = () => {
    if(!CONTEXT.user || !CONTEXT.user.timeZone || !candidate || !candidate.employee || !candidate.employee.timeZone) return 0;

    const firstUserTime = JSON.parse(CONTEXT.user.timeZone);
    const secondUserTime = JSON.parse(candidate.employee.timeZone);

    if(firstUserTime && firstUserTime.offset && secondUserTime && secondUserTime.offset) {
      return firstUserTime.offset - secondUserTime.offset;
    }

    return 0;
  }

  const downloadCV = () => {
    if(!candidate || !candidate.CV || !candidate.CV._id || !candidate.CV.file || !candidate.CV.file.data) {
      alertify.error('Не вдалося знайти резюме');
      return;
    }

    savePdf(candidate.CV.file.data);
  }

  return (
    <div className='candidate' style={{backgroundColor: color}}>
      <div onClick={moveToEmployeePage}>{candidate.employee.username}</div>
      <div>{candidate.employee.email}</div>
      <div>{candidate.text}</div>
      <div>{candidate.testTaskLink}</div>
      <div className='download-cv' onClick={downloadCV}>Завантажити резюме</div>
      <div className='time-offset'>Різниця в часі: {getTimeOffset()} год</div>
      <div className='expectations'>{expectations.type} {expectations.min} - {expectations.max}UAH</div>
      <form onSubmit={updateCandidateStatus} className='select-and-button'>
        <select value={candidateStatus} onChange={handleStatusChange}>
          <option value="accepted">Прийнято</option>
          <option value="denied">Відхилено</option>
          <option value="pending">Очікування</option>
        </select>
        <button type='submit' className='button secondary-button'>Прийняти зміну</button>
      </form>
    </div>
  )
}
