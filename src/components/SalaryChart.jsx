import React, { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2';
import { salaries } from '../data/salary';
import { checkSimilarity } from '../helpers';

export const SalaryChart = ({ payment, name }) => {
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [average, setAverage] = useState(0);

  useEffect(() => {
    if(!payment) return;

    if(payment.type === 'hourly') {
      const minValue = payment.min * 160;
      const maxValue = payment.max * 160;
      const average = computeAverage();

      setMin(minValue);
      setMax(maxValue);
      setAverage(average);
    } else if(payment.type === 'monthly') {
      const average = computeAverage();

      setMin(payment.min);
      setMax(payment.max);
      setAverage(average);
    }
  }, [payment]);

  const computeAverage = () => {

    const vacanciesWithSimilarity = salaries.map(s => ({ vacancy: s, similarity: checkSimilarity(s.name.toLowerCase(), name.toLowerCase(), true)}))
    
    vacanciesWithSimilarity.sort((a, b) => b.similarity - a.similarity);

    return vacanciesWithSimilarity[0].vacancy.value;
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Порівняння із середньою оплатою для вакансії ${name}`
      }
    },
    scales:{
      x: {
        display: false
      }
    }
  };

  const data = {
    labels: ['Порівняння рівнів оплати, UAH'],
    datasets: [
      {
        label: 'Мінімальна очікувана оплата перерахована на місяць',
        data: [min],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: `Середня заробітна плата за місяць в Україні для вакансії ${name}`,
        data: [average],
        backgroundColor: 'rgba(22, 81, 16, 0.5)',
      },
      {
        label: 'Максимальна очікувана оплата перерахована на місяць',
        data: [max],
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return (
    <Bar options={options} data={data} />
  )
}
