import "react-datepicker/dist/react-datepicker.css";
import 'react-phone-number-input/style.css';

import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { EMPLOYEE_PERSONAL_URL } from '../../constants';
import { BACKEND, OPENAI } from '../../axios';
import { AppContext } from '../../context/context';
import { List, LanguageSelector } from '../../components';
import DatePicker from "react-datepicker";
import PhoneInput from 'react-phone-number-input';
import { LANGUAGES } from '../../context/context.js';
import alertify from "alertifyjs";
import { savePdf } from "../../helpers.js";

const SECTIONS = ['Контактні дані', 'Освіта', 'Досвід роботи', 'Навички', 'Характеристика', 'Додатково', 'Підсумок'];

const testCVData = {
  "CV_language": "ENGLISH",
  "first_name": "Дмитро",
  "last_name": "Романчук",
  "city": "Холодна Балка",
  "country": "Ukraine",
  "phone": "+0968517833",
  "email": "dmytroromanchuk864@gmail.com",
  "postal_code": "67660",
  "role": "Фронтенд-розробник",
  "degree": "Вища",
  "field_of_study": "ІТ",
  "school_name": "МАУП",
  "school_location": "Одеса, Україна",
  "graduation_date": 1717189200000,
  "school_mark": "4.95",
  "job_title": "Фронтенд-розробник",
  "employer": "Юні",
  "job_start_date": 1657746000000,
  "job_end_date": null,
  "still_working": true,
  "job_description": "Робив сайти та веб-додатки",
  "skills": [
      {
          "name": "CSS Preprocessors",
          "value": "4",
          "id": "skills-1713087035211"
      },
      {
          "name": "Browser Developer Tools",
          "value": "3",
          "id": "skills-1713087038346"
      },
      {
          "name": "Web Performance Optimization",
          "value": "3",
          "id": "skills-1713087042063"
      },
      {
          "name": "HTML",
          "value": "5",
          "id": "skills-1713087046793"
      }
  ],
  "self_characteristics": "Робота фронтенд-розробника вимагає від мене постійної уваги до деталей та бажання досягати ідеального результату. Постійно вдосконалюю свої навички, щоб забезпечити користувачам максимальний комфорт при використанні веб-сайтів\nРобота над проектами не завжди легка, але саме це мене мотивує до пошуку кращих рішень та технологій. Глибокий аналіз та пошук оптимального шляху досягнення результату - це моя філософія\nУ моїх руках веб-сайти стають не лише інтерактивними, але і зручними для користувачів. Я відданий своїй роботі, тому що вірю, що я можу зробити Інтернет кращим місцем для всіх.",
  "languages": [
      {
          "name": "англійська",
          "value": "просунутий",
          "id": "languages-1713087080872"
      },
      {
          "name": "французька",
          "value": "базовий",
          "id": "languages-1713087100826"
      }
  ],
  "sertificates": "https://drive.google.com/drive/folders/1-GMQ79Umb-qsYtIX6mxonMsbLX69DmX_",
  "portfolio": "https://github.com/dimitrrr",
  "additionalFields": [
      {
          "name": "Тестове поле",
          "value": "тестове значення",
          "id": "additionalfields-1713087127071"
      }
  ]
};

export const CVCreator = () => {
  const navigate = useNavigate();
  const CONTEXT = useContext(AppContext);
  const [currentSection, setCurrentSection] = useState(0);
  const [CVData, setCVData] = useState({CV_language: LANGUAGES.UKRAINIAN});
  const [additionalFields, setAdditionalFields] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [skills, setSkills] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [stillWorking, setStillWorking] = useState(false);
  const [graduationDate, setGraduationDate] = useState(null);
  const [phone, setPhone] = useState();
  const [suggestedSkills, setSuggestedSkills] = useState([]);
  const [suggestedCharacteristics, setSuggestedCharacteristics] = useState([]);
  const [CVlanguage, setCVlanguage] = useState(LANGUAGES.UKRAINIAN);

  useEffect(() => {
    // Anything in here is fired on component mount.
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      // Anything in here is fired on component unmount.
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    }
  }, []);

  useEffect(() => {

    if(currentSection === 3) {
      const data = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `10 навичок, які потрібні для професії ${CVData.role || ''}. Навички розділяй за допомогою знаку '-' (мінус). Кожна навичка має складатися з 1-2 слів і бути іменником. У відповіді не використовуй нумерацію та маркеровані списки.`}],
      });

      OPENAI.post('', data).then(response => {
        const result = response.data.choices[0]?.message?.content;
        const skillsToSuggest = result.split('-').map(sk => sk.trim());
        setSuggestedSkills(skillsToSuggest);
      }).catch(error => {
        console.error(error);
      })
    }

    if(currentSection === 4) {
      const data = JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: `Напиши 3 різні короткі абзаци (до 70 слів), які могли б охарактеризувати робітника з професією ${CVData.role || ''} у діловому стилі від першої особи без перерахування навичок. У кінці абзацу постав знак ";" (крапка з комою). У відповіді не використовуй нумерацію або маркеровані списки`}],
      });

      OPENAI.post('', data).then(response => {
        const result = response.data.choices[0]?.message?.content;
        const characteristicsToSuggest = result.split(';').map(ch => ch.trim()).filter((ch) => ch.length > 0);
        setSuggestedCharacteristics(characteristicsToSuggest);
      }).catch(error => {
        console.error(error);
      })
    }


  }, [currentSection]);

  const beforeUnloadHandler = (e) => {
    e.preventDefault();
    e.returnValue = true;
  }

  const handleSuggestedCharacteristicsSelect = (text) => {
    const newCVData = { ...CVData, self_characteristics: CVData.self_characteristics && CVData.self_characteristics.length ? CVData.self_characteristics + '\n' + text : text };
    setCVData(newCVData);
  }

  const handleDateChange = (date, type) => {
    if(type === 'start') {
      setStartDate(date);
      const newCVData = { ...CVData, job_start_date: date.getTime() };
      setCVData(newCVData);
    } else if(type === 'end') {
      setEndDate(date);
      const newCVData = { ...CVData, job_end_date: date.getTime() };
      setCVData(newCVData);
    } else if(type === 'graduation') {
      setGraduationDate(date);
      const newCVData = { ...CVData, graduation_date: date.getTime() };
      setCVData(newCVData);
    }
  }

  const handleSetPhone = (value) => {
    setPhone(value);
    const newCVData = { ...CVData, phone: value };
    setCVData(newCVData);
  }

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setCVData((prevProps) => ({
      ...prevProps,
      [name]: value
    }));
  };

  const handleCheckboxChange = (event) => {
    const value = event.target.checked;

    if(value) {
      setStillWorking(true);
      setEndDate(null);
      const newCVData = { ...CVData, job_end_date: null, still_working: true };
      setCVData(newCVData);
    } else {
      setStillWorking(false);
      const newCVData = { ...CVData, still_working: false };
      setCVData(newCVData);
    }
  }

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

    try {
      BACKEND.post('/createPdf', CV).then(response => {

        if(response.data && response.data.status === 'ok' && response.data.data && response.data.data.file && response.data.data.file.data) {
          savePdf(response.data.data.file.data);
          setCVData({});
        } else {
          alertify.error("Не вдалося створити резюме");
          console.error(response);
        }
      });
    } catch(error) {
      alertify.error("Не вдалося створити резюме");
      console.error(error);
    }
  }

  const onAfterAdditionalFieldsUpdate = (newFields) => {
    const newCVData = { ...CVData, additionalFields: newFields };
    setAdditionalFields(newFields);
    setCVData(newCVData);
  };

  const onAfterLanguagesUpdate = (newLanguages) => {
    const newCVData = { ...CVData, languages: newLanguages };
    setLanguages(newLanguages);
    setCVData(newCVData);
  };

  const onAfterSkillsUpdate = (newSkills) => {
    const newCVData = { ...CVData, skills: newSkills };
    setSkills(newSkills);
    setCVData(newCVData);
  };

  const onChangeLanguage = selectedLanguage => {
    const newCVData = { ...CVData, CV_language: selectedLanguage };
    setCVlanguage(selectedLanguage);
    setCVData(newCVData);
  }
  
  const renderSectionById = (section) => {
    if(section === 0) {
      return (
        <div className='resume-section'>
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
            <PhoneInput value={phone} onChange={handleSetPhone} />
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
          <LanguageSelector defaultLanguage={CVlanguage} onChangeLanguage={onChangeLanguage} />  
          <div className="buttons">
            <button className='button secondary-button' onClick={handlePrevious}>Скасувати</button>
            <button className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</button>
          </div>
        </div>
      );
    }

    if(section === 1) {
      return (
        <div className='resume-section'>
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
            <label>Місяць та рік закінчення навчання</label>
            <DatePicker selected={graduationDate} onChange={(date) => handleDateChange(date, 'graduation')} dateFormat="MM/yyyy" showMonthYearPicker showFullMonthYearPicker/>
          </div>
          <div>
            <label>Середній бал документу про освіту</label>
            <input type='text' name='school_mark' value={CVData.school_mark || ''} onChange={handleInputChange} />
          </div>
          <div className="buttons">
            <button className='button secondary-button' onClick={handlePrevious}>Назад</button>
            <button className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</button>
          </div>
        </div>
      );
    }

    if(section === 2) {
      return (
        <div className='resume-section'>
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
            <DatePicker selected={startDate} onChange={(date) => handleDateChange(date, 'start')} />
          </div>
          <div>
            <label>Дата завершення роботи</label>
            <DatePicker selected={endDate} minDate={startDate || null} disabled={stillWorking} onChange={(date) => handleDateChange(date, 'end')} />
          </div>
          <div>
            <input type='checkbox' checked={stillWorking} onChange={handleCheckboxChange} /> Досі працюю тут
          </div>
          <div>
            <label>Додатковий опис</label>
            <textarea name='job_description' value={CVData.job_description || ''} onChange={handleInputChange} />
          </div>
          <div className="buttons">
            <button className='button secondary-button' onClick={handlePrevious}>Назад</button>
            <button className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</button>
          </div>
        </div>
      );
    }

    if(section === 3) {
      const skillLevels = ['1', '2', '3', '4', '5'];
      return (
        <div className='resume-section'>
          <div>
            <label>Професійні навички та рівень володіння (1 - мінімальне володіння, 5 - експертність)</label>
            <List initialItems={skills} onAfterUpdate={onAfterSkillsUpdate} type='itemswithselect' name='skills' values={skillLevels} initialValue={skillLevels[0]} suggested={suggestedSkills} role={CVData.role || ''}  showSuggested={true} />
          </div>
          <div className="buttons">
            <button className='button secondary-button' onClick={handlePrevious}>Назад</button>
            <button className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</button>
          </div>
        </div>
      );
    }

    if(section === 4) {
      return (
        <div className='resume-section'>
          <div>
            {
              <div className='typical typical-characteristics'>
                Наприклад{CVData.role ? `, для вакансії "${CVData.role}"` : ''}:
                <div className='typical-examples'>
                {
                  suggestedCharacteristics && suggestedCharacteristics.length ? suggestedCharacteristics.map((s, i) => (
                    <div className='example characteristic' key={s+i+Date.now()} onClick={() => handleSuggestedCharacteristicsSelect(s)}>{s}</div>
                  )) : null
                }
                </div>
              </div>
            }
            <textarea name='self_characteristics' value={CVData.self_characteristics || ''} onChange={handleInputChange} />
          </div>
          <div className="buttons">
            <button className='button secondary-button' onClick={handlePrevious}>Назад</button>
            <button className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</button>
          </div>
        </div>
      );
    }

    if(section === 5) {
      const languageLevels = ['початковий (А1)', 'базовий (А2)', 'середній (B1)', 'вище середнього (B2)', 'просунутий (C1)', 'майстерний (C2)'];
      return (
        <div className='resume-section'>
          <div>
            <label>Знання мов</label>
            <List initialItems={languages} onAfterUpdate={onAfterLanguagesUpdate} type='itemswithselect' name='languages' values={languageLevels} initialValue={languageLevels[0]} showSuggested={false} />
          </div>
          <div>
            <label>Посилання на сертифікати</label>
            <input type='text' name='sertificates' value={CVData.sertificates || ''} onChange={handleInputChange} />
          </div>
          <div>
            <label>Посилання на портфоліо</label>
            <input type='text' name='portfolio' value={CVData.portfolio || ''} onChange={handleInputChange} />
          </div>
          <div className="add-field">
            <label>За необхідності додайте більше полів</label>
            <List initialItems={additionalFields} onAfterUpdate={onAfterAdditionalFieldsUpdate} type='itemswithinput' name='additionalfields' showSuggested={false} />
          </div>
          <div className="buttons">
            <button className='button secondary-button' onClick={handlePrevious}>Назад</button>
            <button className='button primary-button' onClick={handleNext}>Далі - {SECTIONS[currentSection + 1]}</button>
          </div>
        </div>
      );
    }

    if(section === 6) {
      return (
        <div className='resume-section'>
          <div>
            <button className='button primary-button' onClick={createAndDownloadPdf}>Згенерувати резюме</button>
          </div>
          <div className="buttons">
            <button className='button secondary-button' onClick={handlePrevious}>Назад</button>
            <button className='button secondary-button' onClick={handleBackToPersonal}>Повернутися в особистий кабінет</button>
          </div>
        </div>
      );
    }
  }


  return (
    <div className='resume-page'>
      <h2>{SECTIONS[currentSection]}</h2>
      { renderSectionById(currentSection) }
    </div>
  )
}
