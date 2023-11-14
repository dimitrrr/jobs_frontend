import React, { useState } from 'react'
import { CompanyData, PostedVacancies } from '../../components';

export const EmployerPersonal = () => {
  const [currentView, setCurrentView] = useState(0);

  const renderByCurrentView = () => {
    if(currentView === 0) return <PostedVacancies />
    if(currentView === 1) return <CompanyData />

    return <></>
  }

  const renderSidebar = () => {
    const views = ['Розміщені вакансії', 'Інформація про компанію', 'Відгуки'];
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
