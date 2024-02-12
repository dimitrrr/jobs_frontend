import React, { useEffect, useState } from 'react'

export const List = ({ onAfterUpdate, initialItems=[], values=[], initialValue='', type='items', name='list' }) => {
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
    <div>
      <div>
        <input
          type="text"
          name="inputText"
          value={inputText}
          onChange={handleInputTextChange}
        />
        { type === 'itemswithinput' ? (
          <input
            type="text"
            name="inputValue"
            value={inputValue}
            onChange={handleInputValueChange}
          />
        ) : null }
        { type === 'itemswithselect' ? (
          <select value={inputValue} onChange={handleInputValueChange}>
            {values.map((v, i) => <option key={v + i} value={v}>{v}</option>)}
          </select>
        ) : null }
        <button type='button' onClick={handleAddItem}>+</button>
      </div>
      <div>
        {
          items.length ? items.map(item => (
            <div key={item.id}>
              <div>{item.name}</div>
              {
                type !== 'items' ? <div>{item.value}</div> : null
              }
              <button type='button' onClick={() => handleRemove(item.id)}>Trash</button>
            </div>
          )) : null
        }
      </div>
    </div>
  )
}
