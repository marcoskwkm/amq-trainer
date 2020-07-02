import React from 'react'

import { Route } from '../../constants'
import Login from '../Login'

interface NavbarProps {
  onRouteChange: (route: Route) => void
}

const Navbar: React.FC<NavbarProps> = ({ onRouteChange }) => {
  return (
    <nav className="dt w-100 border-box ph3 bb h3">
      <div className="dtc v-mid w-50 tl">
        <span
          className="link dim dark-gray f6 f5-ns dib fw6 pointer"
          onClick={() => onRouteChange(Route.HOME)}
        >
          AMQTrainer
        </span>
        <span
          className="link dim dark-gray f6 f5-ns dib ml3 ml4-ns pointer"
          onClick={() => onRouteChange(Route.PRACTICE)}
        >
          Practice
        </span>
        <span
          className="link dim dark-gray f6 f5-ns dib ml3 ml4-ns pointer"
          onClick={() => onRouteChange(Route.UPDATE_DATABASE)}
        >
          Update database
        </span>
      </div>
      <div className="dtc v-mid w-50">
        <Login />
      </div>
    </nav>
  )
}

export default Navbar
