import React, { useState } from 'react'
import { CandidateVacancies, HiddenVacancies, SavedVacancies, UserData } from '../../components';

export const EmployeePersonal = () => {
  const [currentView, setCurrentView] = useState(0);

  const renderByCurrentView = () => {
    if(currentView === 0) return <CandidateVacancies />
    // if(currentView === 1) return <CompanyData />
    if(currentView === 2) return <UserData />
    if(currentView === 3) return <SavedVacancies />
    if(currentView === 4) return <HiddenVacancies />

    return <></>
  }

  const renderSidebar = () => {
    const views = ['Мої заявки', 'Мої резюме', 'Дані користувача', 'Збережені вакансії', 'Приховані вакансії', 'Відгуки'];
    return views.map((v, i) => <div className={`view ${currentView === i ? 'view-active' : ''}`} key={`employee-view-${i}`} onClick={() => setCurrentView(i)}>{v}</div>);
  }

  return (
    <div className='sidebar-page'>
      <aside>
        { renderSidebar() }
      </aside>
      <article>
        { renderByCurrentView() }
      </article>
    </div>
  )
}
