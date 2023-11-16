import React from 'react'
import { Candidate } from './Candidate'

export const CandidatesForVacancy = ({candidates}) => {

  return (
    <div>
        {candidates.map(c => <Candidate key={c._id} candidate={c} />)}
    </div>
  )
}
