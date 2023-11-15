import React from 'react'
import { useNavigate } from 'react-router-dom';
import { EMPLOYER_PROFILE_PAGE_URL } from '../constants';

export const EmployerData = ({company, employerId, shortForm = false}) => {
  const navigate = useNavigate();

  const moveToEmployerPage = () => {
    navigate(`${EMPLOYER_PROFILE_PAGE_URL}?employer_id=${employerId}`);
  };

  return (
    <div className="employer" onClick={shortForm ? moveToEmployerPage : null}>
        { company.logo ? <img width={100} height={100} src={company.logo} alt={'company logo'} /> : null }
        { company.name ? <div className="company">{company.name}</div> : null }
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
