import { createContext, useReducer, type ReactNode } from 'react'
import type { AppState } from '../types'
import { reducer, initialState, type Action } from './reducer'

type AppContextType = {
  state: AppState
  dispatch: React.Dispatch<Action>
}

export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
