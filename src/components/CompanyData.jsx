import React, { useContext, useState } from 'react'
import { AppContext } from '../context/context'
import { BACKEND } from '../axios';
import alertify from 'alertifyjs';

export const CompanyData = () => {
  const CONTEXT = useContext(AppContext);
  const companyData = JSON.parse(CONTEXT.user.company || "{}");

  const [companyState, setCompanyState] = useState({
    name: companyData && companyData.name ? companyData.name : '',
    area: companyData && companyData.area ? companyData.area : '',
    description: companyData && companyData.description ? companyData.description : '',
    logo: companyData && companyData.logo ? companyData.logo : '',
    link: companyData && companyData.link ? companyData.link : '',
  });
  const [currentMode, setCurrentMode] = useState(1);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCompanyState((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const renderShowMode = () => {
    return (
      <div className='companyDataView'>
        <button className='button secondary-button' onClick={() => setCurrentMode(2)}>Редагувати</button>
        <div>{ companyData && companyData.logo ? <img src={companyData.logo} width={100} height={100} alt='logo' /> : null }</div>
        <div>{ companyData && companyData.name }</div>
        <div>{ companyData && companyData.area }</div>
        <div>{ companyData && companyData.description }</div>
        {companyData && companyData.link ? (
          <a href={companyData.link}>{ companyData.link }</a>
        ) : null}
      </div>
    )
  }

  const renderEditMode = () => {
    return (

      <form className='companyDataEdit' onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Логотип</label>
          <input
            type="file"
            accept=".png, .jpg, .jpeg"
            name="logo"
            title=""
            onChange={convertToBase64}
          />
          {companyState.logo ? <img width={100} height={100} src={companyState.logo} alt='logo' /> : null}
          
        </div>
        <div className="form-control">
          <label>Назва</label>
          <input
            type="text"
            name="name"
            value={companyState.name}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control">
          <label>Сфера діяльності</label>
          <input
            type="text"
            name="area"
            value={companyState.area}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control">
          <label>Опис</label>
          <textarea
            type="text"
            name="description"
            value={companyState.description}
            onChange={handleInputChange}
          />
        </div>
        <div className="form-control">
          <label>Посилання на сайт компанії</label>
          <input
            type="text"
            name="link"
            value={companyState.link}
            onChange={handleInputChange}
          />
        </div>
        <div className="buttons">
          <button type='submit' className='button primary-button'>Зберегти</button>
          <button className='button secondary-button' onClick={() => setCurrentMode(1)}>Скасувати</button>
        </div>
    </form>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const updatedUser = { ...CONTEXT.user, company: JSON.stringify(companyState) };
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser});

    try {
      BACKEND.post('/updateUser', updatedUser).then(response => {
        if(response.data && response.data.status === 'ok') {
          setCurrentMode(1);
        } else {
          alertify.error("Не вдалося оновити дані");
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error("Не вдалося оновити дані");
      console.error(error);
    }
  };

  const convertToBase64 = (e) => {
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setCompanyState((prevProps) => ({
        ...prevProps,
        logo: reader.result
      }));
    }
    reader.onerror = error => {
      alertify.error('Не вдалося обробити файл');
      console.error(error);
    }
  } 

  return (
    <div>
      <div className='companyDataInfo'>Для того, щоб відкрити всі можливості роботодавця, вкажіть інформацію про свою компанію.</div>
      { currentMode === 1 ? renderShowMode() : null }
      { currentMode === 2 ? renderEditMode() : null }
    </div>
  )
}
