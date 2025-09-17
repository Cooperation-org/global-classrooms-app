'use client';

import React, { createContext, useContext, useReducer, ReactNode, Dispatch } from 'react';

// Example state type (customize as needed)
type State = {
  user: null | { id: string; name: string };
  isLandingPage: null | boolean;
  // Add more global state fields here
};

const initialState: State = {
  user: null,
  isLandingPage: false,
};

type Action =
  | { type: 'SET_USER'; payload: { id: string; name: string } | null }
  | { type: 'SET_IS_LANDING_PAGE'; payload: boolean };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_IS_LANDING_PAGE':
      return { ...state, isLandingPage: action.payload };
    default:
      return state;
  }
}

const GlobalStateContext = createContext<{ state: State; dispatch: Dispatch<Action> } | undefined>(undefined);

export function GlobalStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <GlobalStateContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) throw new Error('useGlobalState must be used within GlobalStateProvider');
  return context;
} 