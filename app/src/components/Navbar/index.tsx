import React from 'react'

import { Route } from '../../constants'

interface NavbarProps {
  onRouteChange: (route: Route) => void
}

const Navbar: React.FC<NavbarProps> = ({ onRouteChange }) => {
  return (
    <nav className="dt w-100 border-box pa3 bb">
      <div className="dtc v-mid w-75 tl">
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
      <div className="dtc v-mid w-25 tr">
        <span
          className="link dim dark-gray f6 f5-ns dib pointer"
          onClick={() => alert('Please purchase the full version to login.')}
        >
          Login
        </span>
      </div>
    </nav>
  )
}

export default Navbar
