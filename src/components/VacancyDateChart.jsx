import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { checkSimilarity } from '../helpers';
import { MONTHS } from '../context/context';

const colors = [
  'rgba(255, 99, 132, 0.5)',
  'rgba(22, 81, 16, 0.5)',
  'rgba(53, 162, 235, 0.5)',
]

export const VacancyDateChart = ({ vacancies, name }) => {
  const [dataset, setDataset] = useState([]);

  useEffect(() => {
    if(!vacancies) return;

    const vacanciesWithSimilarity = vacancies.map(v => ({ vacancy: v, similarity: checkSimilarity(v.name.toLowerCase(), name.toLowerCase())}));
    const filteredVacancies = vacanciesWithSimilarity.filter(v => v.similarity > 0.5);

    const vacanciesGroupedByMonth = Object.groupBy(filteredVacancies, v => {
      if(!v.vacancy.timestamp) return null;

      const date = new Date(v.vacancy.timestamp);
      return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
    });

    const newDatasets = Object.keys(vacanciesGroupedByMonth).map((month, index) => ({
      label: month,
      data: [vacanciesGroupedByMonth[month].length],
      backgroundColor: colors[index % colors.length],
    }));
    
    setDataset(newDatasets);

  }, [vacancies]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Кількість опублікованих вакансій ${name}`
      }
    },
    scales:{
      // x: {
      //   display: false
      // },
      y: {
        ticks: {
          callback: (val) => Number.isInteger(val) ? val : ''
        }
      }
    }
  };

  const data = {
    labels: ['Кількість опублікованих вакансій'],
    datasets: dataset,
  };

  if(!dataset && !dataset.length) return;

  return (
    <Bar options={options} data={data} />
  )
}
