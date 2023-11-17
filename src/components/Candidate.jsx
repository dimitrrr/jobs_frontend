import React, { useContext, useEffect, useState } from 'react'
import { BACKEND } from '../axios';
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { EMPLOYEE_PROFILE_PAGE_URL } from '../constants';
import { saveAs } from 'file-saver';

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
    return status === 'accepted' ? '#00ff00' : status === 'denied' ? '#ff0000' : '#ffffff';
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

    BACKEND.post('/updateCandidate', newCandidate).then(response => {
      setColor(getColorByStatus(candidateStatus));
    });

  }

  const moveToEmployeePage = () => {
    navigate(`${EMPLOYEE_PROFILE_PAGE_URL}?employee_id=${candidate.employee._id}`);
  }

  const getTimeOffset = () => {
    const firstUserTime = JSON.parse(CONTEXT.user.timeZone);
    const secondUserTime = JSON.parse(candidate.employee.timeZone);

    if(firstUserTime && firstUserTime.offset && secondUserTime && secondUserTime.offset) {
      return firstUserTime.offset - secondUserTime.offset;
    }

    return 0;
  }

  const downloadCV = () => {
    BACKEND.post('/fetchCreatedPdf', {employeeId: candidate.employee._id, CVid: candidate.CV._id}, { responseType: 'blob' }).then(response2 => {
          
      if(response2.data instanceof Blob) {
        const pdfBlob = new Blob([response2.data], { type: 'application/pdf' });

        saveAs(pdfBlob, 'CV.pdf');
      }
    });
  }

  return (
    <div className='candidate' style={{backgroundColor: color}}>
      <div onClick={moveToEmployeePage}>{candidate.employee.username}</div>
      <div>{candidate.employee.email}</div>
      <div>{candidate.text}</div>
      <div>{candidate.testTaskLink}</div>
      <div onClick={downloadCV}>CV: {candidate.CV._id}</div>
      <div>Різниця в часі: {getTimeOffset()} годин</div>
      <div>{expectations.type} {expectations.min}-{expectations.max}</div>
      <form onSubmit={updateCandidateStatus} >
        <select value={candidateStatus} onChange={handleStatusChange}>
          <option value="accepted">Прийнято</option>
          <option value="denied">Відхилено</option>
          <option value="pending">Очікування</option>
        </select>
        <button type='submit'>Прийняти зміну</button>
      </form>
    </div>
  )
}
