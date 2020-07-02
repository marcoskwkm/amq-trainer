import React, { useState } from 'react'

import Home from './components/Home'
import Navbar from './components/Navbar'
import Practice from './components/Practice'
import UpdateDatabase from './components/UpdateDatabase'
import { ConfigContextProvider } from './context/ConfigContext'
import { UserContextProvider } from './context/UserContext'
import { Route } from './constants'

const App = () => {
  const [route, setRoute] = useState(Route.HOME)

  return (
    <ConfigContextProvider>
      <UserContextProvider>
        <Navbar onRouteChange={setRoute} />
        <div className="pa3 center">
          {route === Route.HOME ? (
            <Home />
          ) : route === Route.PRACTICE ? (
            <Practice />
          ) : route === Route.UPDATE_DATABASE ? (
            <UpdateDatabase />
          ) : null}
        </div>
      </UserContextProvider>
    </ConfigContextProvider>
  )
}

export default App
