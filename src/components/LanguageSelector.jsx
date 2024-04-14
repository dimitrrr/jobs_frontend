import React, { useEffect, useState } from 'react'
import { LANGUAGES } from '../context/context';

export const LanguageSelector = ({defaultLanguage = LANGUAGES.UKRAINIAN, onChangeLanguage}) => {
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    setLanguage(defaultLanguage);
  }, [defaultLanguage]);

  const switchLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    onChangeLanguage(selectedLanguage);
  };

  return (
    <div className="language-selector">
      <p>Мова резюме:</p>
      <button className={language === LANGUAGES.UKRAINIAN ? 'active' : ''} onClick={() => switchLanguage(LANGUAGES.UKRAINIAN)}>Українська</button>
      <button className={language === LANGUAGES.ENGLISH ? 'active' : ''} onClick={() => switchLanguage(LANGUAGES.ENGLISH)}>English</button>
    </div>
  );
}
