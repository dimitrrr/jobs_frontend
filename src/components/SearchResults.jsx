import React from 'react'
import { VacancyRow } from './VacancyRow'

export const SearchResults = ({results, setVacancyToList}) => {
  return results.map(r => <VacancyRow key={r._id} isForEmployer={false} vacancy={r} setVacancyToList={setVacancyToList} />);
}
