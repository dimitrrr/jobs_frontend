import React, { useContext, useState } from 'react'
import { AppContext } from '../context/context'
import { BACKEND } from '../axios';

export const CompanyData = () => {
  const CONTEXT = useContext(AppContext);
  // console.log(CONTEXT.user.company)
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
      <>
      <button onClick={() => setCurrentMode(2)}>Редагувати</button>
      <div>{ companyData && companyData.logo ? <img src={companyData.logo} width={100} height={100} alt='logo' /> : null }</div>
      <div>{ companyData && companyData.name }</div>
      <div>{ companyData && companyData.area }</div>
      <div>{ companyData && companyData.description }</div>
      <div>{ companyData && companyData.link }</div>
      </>
    )
  }

  const renderEditMode = () => {
    return (

      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Логотип</label>
          <input
            type="file"
            accept='image/*'
            name="logo"
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
          <label>Посилання</label>
          <input
            type="text"
            name="link"
            value={companyState.link}
            onChange={handleInputChange}
          />
        </div>
        <button type='submit'>Зберегти</button>
        <button type='button' onClick={() => setCurrentMode(1)}>Скасувати</button>
    </form>
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const updatedUser = { ...CONTEXT.user, company: JSON.stringify(companyState) };
    CONTEXT.updateState({ ...CONTEXT, user: updatedUser });
 
    BACKEND.post('/updateUser', updatedUser).then(response => {
      setCurrentMode(1);
    });
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
      console.log('error: ' + error);
    }
  } 

  return (
    <div>
      <div>Для того, щоб відкрити всі можливості роботодавця, вкажіть інформацію про свою компанію.</div>
      { currentMode === 1 ? renderShowMode() : null }
      { currentMode === 2 ? renderEditMode() : null }
    </div>
  )
}
