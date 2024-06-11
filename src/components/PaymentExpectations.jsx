import React from 'react'

export const PaymentExpectations = ({expectations, handleExpectationsChange}) => {
  return (
    <div className="form-control payment-expectations">
      <div className='expectations-title' style={{fontWeight: 'bold'}}>
        Вкажіть очікуваний тип та рівень оплати, UAH
      </div>
      <div className="radio">
        <label>
          <input 
            type="radio" 
            value="hourly"
            name='type'
            checked={expectations.type === 'hourly'} 
            onChange={handleExpectationsChange}
          />
          Ставка за годину
        </label>
      </div>
      <div className="radio">
        <label>
          <input 
            type="radio" 
            name='type'
            value="monthly" 
            checked={expectations.type === 'monthly'} 
            onChange={handleExpectationsChange}
          />
          Оплата за місяць
        </label>
      </div>
      <div className="radio">
        <label>
          <input 
            name='type'
            type="radio" 
            value="once" 
            checked={expectations.type === 'once'} 
            onChange={handleExpectationsChange}
          />
          Оплата за весь проєкт
        </label>
      </div>
      <div className='form-control expectations-inputs'>
        <input 
          type='text' 
          name='min' 
          placeholder='Мін' 
          value={expectations.min}
          onChange={(event) => handleExpectationsChange(event, 'min')}
        />-<input 
        type='text' 
        name='max' 
        placeholder='Макс' 
        value={expectations.max}
        onChange={(event) => handleExpectationsChange(event, 'max')}
      />
    </div>
  </div>
  )
}
