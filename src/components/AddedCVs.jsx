import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/context';
import { useNavigate } from 'react-router-dom';
import { CV_CREATOR_URL } from '../constants';
import { BACKEND } from '../axios';

export const AddedCVs = () => {
    const CONTEXT = useContext(AppContext);
    const navigate = useNavigate();
    const [addedCVs, setAddedCVs] = useState([]);
  
    useEffect(() => {
      if(CONTEXT.user && CONTEXT.user._id) {
        BACKEND.post('/getAddedCVsById', { _id: CONTEXT.user._id }).then(response => {
          if(response.data.status === 'ok' && response.data.data) {
            const CVs = response.data.data;
  
            setAddedCVs(CVs);
          }
        });
      }
    }, [CONTEXT.user._id]);
  
    // const renderCVs = () => {
    //   if(!addedCVs || !addedCVs.length) return <></>
  
    //   return employerVacancies.map(v => <VacancyRow key={v._id} isForEmployer={true} vacancy={v} updateVacancyStatus={updateVacancyStatus} />);
    // }
  
    const moveToCVCreator = id => {
      navigate(`${CV_CREATOR_URL}?CV_id=${id}`);
    }
  
    return (
      <div className='vacancies'>
        <button onClick={() => moveToCVCreator('new')}>Створити резюме</button>
        <div className="posted">
          {/* {renderCVs()} */}
        </div>
      </div>
    )
}
