import React, { createContext, useContext, useMemo, useState } from 'react'

interface ConfigContext {
  sampleLength: number
  setSampleLength: (length: number) => void
}

const ConfigContext = createContext<ConfigContext>({
  sampleLength: 30,
  setSampleLength: () => {},
})

export const ConfigContextProvider: React.FC = ({ children }) => {
  const [sampleLength, setSampleLength] = useState<number>(30)

  const value = useMemo<ConfigContext>(
    () => ({
      sampleLength,
      setSampleLength,
    }),
    [sampleLength, setSampleLength]
  )

  return (
    <ConfigContext.Provider value={value}>{children}</ConfigContext.Provider>
  )
}

export const useConfig = () => {
  return useContext(ConfigContext)
}
