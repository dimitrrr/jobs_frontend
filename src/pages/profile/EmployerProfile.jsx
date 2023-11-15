import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../context/context';
import { EmployerData } from '../../components';

export const EmployerProfile = (props) => {
  const CONTEXT = useContext(AppContext);
  const [employer, setEmployer] = useState({
    name: '',
    testTaskLink: '',
    description: '',
    area: '',
    logo: '',
    _id: null,
  });

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const employerId = urlParams.get('employer_id');

  useEffect(() => {
    const vacancy = CONTEXT.vacancies.find(v => v.employer._id === employerId);

    if(vacancy && vacancy.employer && vacancy.employer._id) {
      const company = JSON.parse(vacancy.employer.company);
      const _id = vacancy.employer._id;
      setEmployer({...company, _id});
    }
  }, [employerId, CONTEXT.vacancies]);

  return (
    <div className='employer-page'>
      <EmployerData employerId={employer._id} company={employer} shortForm={false} />
    </div>
  )
}
