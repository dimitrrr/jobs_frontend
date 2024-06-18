import React, { useEffect, useState } from 'react'
import { Pie } from 'react-chartjs-2';
import { checkSimilarity } from '../helpers';

export const CandidatesChart = ({ name, candidates }) => {
  const [pending, setPending] = useState(0);
  const [accepted, setAccepted] = useState(0);
  const [denied, setDenied] = useState(0);

  useEffect(() => {
    if(!candidates && !candidates.length) return;

    candidates = candidates.filter(c => {
      if(!c.vacancy || !c.CV) console.error('toremove', c)

      return c.vacancy && c.CV;
    });

    const candidatesWithSimilarity = candidates.map(c => ({ candidate: c, similarity: checkSimilarity(c.vacancy.name.toLowerCase(), name.toLowerCase(), true) }));
  
    const filteredCandidates = candidatesWithSimilarity.filter(c => c.similarity >= 0.5);

    const totalPending = ['pending', 'accepted', 'denied'].map(status => filteredCandidates.filter(c => c.candidate.status === status).length);
    
    setPending(totalPending[0]);
    setAccepted(totalPending[1]);
    setDenied(totalPending[2]);
  }, [candidates]);

  const options = {
    responsive: true,
    aspectRatio: 2,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Кількість кандидатів для всіх вакансій ${name}`
      }
    },
  };

  const data = {
    labels: ['Очікують на розгляд', 'Прийняті', 'Відхилені'],
    datasets: [
      {
        label: 'Кількість кандидатів',
        data: [pending, accepted, denied],
        backgroundColor: [
          'rgba(100, 100, 100, 0.2)',
          'rgba(54, 235, 63, 0.2)',
          'rgba(255, 91, 86, 0.2)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if(pending === 0 && accepted === 0 && denied === 0) return null;

  return (
    <Pie options={options} data={data} />
  )
}
