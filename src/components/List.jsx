import React, { useEffect, useState } from 'react'

export const List = ({ onAfterUpdate, initialItems=[], values=[], initialValue='', type='items', name='list', suggested=[], role='', showSuggested=false }) => {
  const [items, setItems] = useState([]);
  const [inputText, setInputText] = useState('');
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleAddItem = () => {
    if(!inputText || !inputText.length) return;
    const item = { name: inputText, value: inputValue || '', id: `${name}-${Date.now()}` };
    const newItems = [...items, item];

    setItems(newItems);
    setInputText('');
    setInputValue(initialValue);
    onAfterUpdate(newItems);
  }

  const handleInputTextChange = (event) => {
    const { value } = event.target;
    setInputText(value);
  };

  const handleInputValueChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const handleRemove = (id) => {
    const newItems = items.filter(item => item.id !== id);
    setItems(newItems);
    onAfterUpdate(newItems);
  }

  return (
    <div className='custom-list'>
      { showSuggested ? (
          <div className='typical'>
            Наприклад{role ? `, для вакансії "${role}"` : ''}:
            <div className='typical-examples'>
            {
              suggested && suggested.length ? suggested.map((s, i) => (
                <div className='example' key={s+i+Date.now()} onClick={() => setInputText(s)}>{s}</div>
              )) : null
            }
            </div>
          </div>
        ) : null
      }
      <div className='custom-list_input-holder'>
        <div className="form-control input base">
          <input
            type="text"
            name="inputText"
            placeholder='Назва'
            value={inputText}
            onChange={handleInputTextChange}
          />
        </div>
        { type === 'itemswithinput' ? (
          <div className="form-control input">
            <input
              type="text"
              name="inputValue"
              value={inputValue}
              placeholder='Значення'
              onChange={handleInputValueChange}
            />
          </div>
        ) : null }
        { type === 'itemswithselect' ? (
          <div className="form-control input">
            <select value={inputValue} onChange={handleInputValueChange}>
              {values.map((v, i) => <option key={v + i} value={v}>{v}</option>)}
            </select>
          </div>
        ) : null }
        <button type='button' className='button secondary-button' onClick={handleAddItem}>+</button>
      </div>
      <div className='custom-list_added'>
        {
          items.length ? items.map(item => (
            <div key={item.id} className='custom-list_added-item'>
              <div className='custom-list_item-text'>
                <div>{item.name} </div>
                {
                  type !== 'items' ? <div>: {item.value}</div> : null
                }
              </div>
              <button type='button' className='button' onClick={() => handleRemove(item.id)}>x</button>
            </div>
          )) : null
        }
      </div>
    </div>
  )
}
