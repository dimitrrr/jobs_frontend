import React, { useContext, useState } from 'react'
import { CompanyData, Feedback, PostedVacancies, SavedUsers } from '../../components';
import { AppContext } from '../../context/context';

export const EmployerPersonal = () => {
  const CONTEXT = useContext(AppContext);
  const [currentView, setCurrentView] = useState(0);

  const renderByCurrentView = () => {
    if(currentView === 0) return <PostedVacancies />
    if(currentView === 1) return <CompanyData />
    if(currentView === 2) return <SavedUsers />
    if(currentView === 3) return <Feedback userId={CONTEXT.user._id} showAddFeedback={false} sender='employee' />

    return <></>
  }

  const renderSidebar = () => {
    const views = ['Розміщені вакансії', 'Інформація про компанію', 'Збережені робітники', 'Відгуки від робітників'];
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
