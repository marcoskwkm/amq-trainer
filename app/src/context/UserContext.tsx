import React, { createContext, useContext, useMemo, useState } from 'react'

interface UserContext {
  user: string | null
  setUser: (user: string | null) => void
}

const UserContext = createContext<UserContext>({
  user: null,
  setUser: () => {},
})

export const UserContextProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<string | null>(null)

  const value = useMemo<UserContext>(() => ({ user, setUser }), [user, setUser])

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}

export const useUserContext = () => useContext(UserContext)
