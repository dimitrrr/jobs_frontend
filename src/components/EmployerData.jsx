import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { EMPLOYER_PROFILE_PAGE_URL } from '../constants';
import { AppContext } from '../context/context';

export const EmployerData = ({timeZone, company, employerId, shortForm = false}) => {
  const CONTEXT = useContext(AppContext);
  const navigate = useNavigate();

  const moveToEmployerPage = () => {
    navigate(`${EMPLOYER_PROFILE_PAGE_URL}?employer_id=${employerId}`);
  };

  const getTimeOffset = () => {
    if(!timeZone || !CONTEXT.user || !CONTEXT.user.timeZone) return 0;

    const firstUserTime = JSON.parse(CONTEXT.user.timeZone);
    const secondUserTime = JSON.parse(timeZone);

    if(firstUserTime && firstUserTime.offset && secondUserTime && secondUserTime.offset) {
      return firstUserTime.offset - secondUserTime.offset;
    }

    return 0;
  }

  return (
    <div className="employer" onClick={shortForm ? moveToEmployerPage : null}>
      { company.logo ? <img width={100} height={100} src={company.logo} alt={'company logo'} /> : null }
      { company.name ? <div className="company">{company.name}</div> : null }
      <div className='time-offset'>Різниця в часі: {getTimeOffset()} год</div>
      { !shortForm ? (
          <>
              { company.area ? <div className="area">{company.area}</div> : null }
              { company.description ? <div className="description">{company.description}</div> : null }
              { company.link ? <div className="link">{company.link}</div> : company.link }
          </>
      ) : null }
    </div>
  )
}
