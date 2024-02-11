import React, { useContext, useState } from 'react'
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import { EMPLOYEE_PERSONAL_URL } from '../../constants';
import { BACKEND } from '../../axios';
import { AppContext } from '../../context/context';

const SECTIONS = ['Контактні дані', 'Освіта', 'Досвід роботи', 'Навички', 'Характеристика', 'Додатково', 'Підсумок'];

export const CVCreator = () => {
  const navigate = useNavigate();
  const CONTEXT = useContext(AppContext);
  const [currentSection, setCurrentSection] = useState(0);
  const [CVData, setCVData] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCVData((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handlePrevious = () => {
    if(currentSection === 0) {
      return navigate(EMPLOYEE_PERSONAL_URL);
    }

    setCurrentSection(currentSection - 1);
  }

  const handleNext = () => {
    setCurrentSection(currentSection + 1);
  }

  const handleBackToPersonal = () => {
    return navigate(EMPLOYEE_PERSONAL_URL);
  }

  const createAndDownloadPdf = () => {
    const CV = { CVData, employee: CONTEXT.user._id, timestamp: Date.now() };

    BACKEND.post('/createPdf', CV).then(response => {

      if(response.data.status === 'ok') {
        const { employee: employeeId, _id: CVid } = response.data.data;
        BACKEND.post('/fetchCreatedPdf', {employeeId, CVid,}, { responseType: 'blob' }).then(response2 => {
          
          if(response2.data instanceof Blob) {
            const pdfBlob = new Blob([response2.data], { type: 'application/pdf' });
  
            saveAs(pdfBlob, 'CV.pdf');
            setCVData({});
          }
        });
      }
    });
  }
  
  const renderSectionById = (section) => {
    if(section === 0) {
      return (
        <div>
          <div>
            <label>Імʼя</label>
            <input type='text' name='first_name' value={CVData.first_name || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Прізвище</label>
            <input type='text' name='last_name' value={CVData.last_name || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Місто проживання</label>
            <input type='text' name='city' value={CVData.city || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Країна проживання</label>
            <input type='text' name='country' value={CVData.country || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Номер телефону</label>
            <input type='text' name='phone' value={CVData.phone || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Електронна пошта</label>
            <input type='text' name='email' value={CVData.email || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Поштовий індекс</label>
            <input type='text' name='postal_code' value={CVData.postal_code || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Бажана посада</label>
            <input type='text' name='role' value={CVData.role || ''} onChange={handleInputChange} />
          </div>
          <div className="buttons">
            <div className='button secondary-button' onClick={handlePrevious}>Скасувати</div>
            <div className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</div>
          </div>
        </div>
      );
    }

    if(section === 1) {
      return (
        <div>
          <div>
            <label>Рівень освіти</label>
            <input type='text' name='degree' value={CVData.degree || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Галузь освіти</label>
            <input type='text' name='field_of_study' value={CVData.field_of_study || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Назва навчального закладу</label>
            <input type='text' name='school_name' value={CVData.school_name || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Місцерозташування навчального закладу</label>
            <input type='text' name='school_location' value={CVData.school_location || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Місяць закінчення навчання</label>
            <input type='text' name='graduation_month' value={CVData.graduation_month || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Рік завершення навчання</label>
            <input type='text' name='graduation_year' value={CVData.graduation_year || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Додатковий опис</label>
            <textarea name='school_description' value={CVData.school_description || ''} onChange={handleInputChange} />
          </div>
          <div className="buttons">
            <div className='button secondary-button' onClick={handlePrevious}>Назад</div>
            <div className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</div>
          </div>
        </div>
      );
    }

    if(section === 2) {
      return (
        <div>
          <div>
            <label>Назва посади</label>
            <input type='text' name='job_title' value={CVData.job_title || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Назва компанії-роботодавця</label>
            <input type='text' name='employer' value={CVData.employer || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Дата початку роботи</label>
            <input type='text' name='job_start_date' value={CVData.job_start_date || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Дата завершення роботи</label>
            <input type='text' name='job_end_date' value={CVData.job_end_date || ''} onChange={handleInputChange} />
          </div>
          {/* <div>
            <label>Досі працюю тут</label>
            <input type='checkbox' name='job_still_working' value={CVData.job_still_working || ''} onChange={handleInputChange} />
          </div> */}
          <div>
            <label>Додатковий опис</label>
            <textarea name='job_description' value={CVData.job_description || ''} onChange={handleInputChange} />
          </div>
          <div className="buttons">
            <div className='button secondary-button' onClick={handlePrevious}>Назад</div>
            <div className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</div>
          </div>
        </div>
      );
    }

    if(section === 3) {
      return (
        <div>
          <div>
            <label>Професійні навички</label>
            <textarea name='professional_skills' value={CVData.professional_skills || ''} onChange={handleInputChange} />
          </div>
          <div className="buttons">
            <div className='button secondary-button' onClick={handlePrevious}>Назад</div>
            <div className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</div>
          </div>
        </div>
      );
    }

    if(section === 4) {
      return (
        <div>
          <div>
            <label>Характеристика</label>
            <textarea name='self_characteristics' value={CVData.self_characteristics || ''} onChange={handleInputChange} />
          </div>
          <div className="buttons">
            <div className='button secondary-button' onClick={handlePrevious}>Назад</div>
            <div className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</div>
          </div>
        </div>
      );
    }

    if(section === 5) {
      return (
        <div>
          <div>
            <label>Знання мов</label>
            <input type='text' name='languages' value={CVData.languages || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Посилання на сертифікати</label>
            <input type='text' name='sertificates' value={CVData.sertificates || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Посилання на портфоліо</label>
            <input type='text' name='portfolio' value={CVData.portfolio || ''} onChange={handleInputChange} />
          </div>
          <div className='button secondary-button' >Додати поле</div>
          <div className="buttons">
            <div className='button secondary-button' onClick={handlePrevious}>Назад</div>
            <div className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</div>
          </div>
        </div>
      );
    }

    if(section === 6) {
      return (
        <div>
          <div>
            <div className='button secondary-button' onClick={createAndDownloadPdf}>Згенерувати резюме</div>
          </div>
          <div className="buttons">
            <div className='button secondary-button' onClick={handlePrevious}>Назад</div>
            <div className='button primary-button' onClick={handleBackToPersonal}>Повернутися в особистий кабінет</div>
          </div>
        </div>
      );
    }
  }


  return (
    <div>
      <h2>{SECTIONS[currentSection]}</h2>
      { renderSectionById(currentSection) }
    </div>
  )
}
