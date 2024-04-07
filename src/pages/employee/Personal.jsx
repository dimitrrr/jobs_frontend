import React, { useContext, useState } from 'react'
import { AddedCVs, CandidateVacancies, Feedback, HiddenVacancies, RecommendedVacancies, SavedVacancies, UserData } from '../../components';
import { AppContext } from '../../context/context';

export const EmployeePersonal = () => {
  const CONTEXT = useContext(AppContext);
  const [currentView, setCurrentView] = useState(0);

  const renderByCurrentView = () => {
    if(currentView === 0) return <CandidateVacancies />
    if(currentView === 1) return <AddedCVs />
    if(currentView === 2) return <UserData />
    if(currentView === 3) return <RecommendedVacancies />
    if(currentView === 4) return <SavedVacancies />
    if(currentView === 5) return <HiddenVacancies />
    if(currentView === 6) return <Feedback userId={CONTEXT.user._id} sender='employer' showAddFeedback={false} />

    return <></>
  }

  const renderSidebar = () => {
    const views = ['Мої заявки', 'Мої резюме', 'Дані користувача', 'Рекомендовані вакансії', 'Збережені вакансії', 'Приховані вакансії', 'Відгуки від роботодавців'];
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
