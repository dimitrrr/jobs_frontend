import React, { useState } from "react"

export const defaultUser = {
    '_id': 'test',
    username: 'user',
    email: 'email@email.com',
    timeZone: null,
    company: null,
};

export const defaultVacancy = {    
    employer: null,
    text: '',
    status: '',
    name: '',
    tags: [],
    candidates: [],
    testTaskLink: '',
};

export const LANGUAGES = {
    UKRAINIAN: 'UKRAINIAN',
    ENGLISH: 'ENGLISH',
}

export const MONTHS = ['січень', 'лютий', 'березень', 'квітень', 'травень', 'червень', 'липень', 'серпень', 'вересень', 'жовтень', 'листопад', 'грудень'];

const defaultState = {
    user: {},
    updateState: (newState) => {},
};

export const AppContext = React.createContext(defaultState);

export const AppContextProvider = (props) => {
    const [state, setState] = useState(defaultState);

    const updateState = (newState) => {
        setState({...state, ...newState});
    }

    return (
        <AppContext.Provider value={{...state, updateState}}>
            {props.children}
        </AppContext.Provider>
    )
}