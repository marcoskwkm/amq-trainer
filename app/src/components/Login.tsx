import React, { useState } from 'react'

import { useUserContext } from '../context/UserContext'

enum State {
  INITIAL,
  EXPANDED,
  LOGGED_IN,
}

const Login = () => {
  const [state, setState] = useState(State.INITIAL)
  const [value, setValue] = useState('')

  const { user, setUser } = useUserContext()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = () => {
    if (value) {
      setUser(value)
      setState(State.LOGGED_IN)
    }
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSignOut = () => {
    setUser(null)
    setState(State.INITIAL)
  }

  if (state === State.INITIAL) {
    return (
      <div className="tr v-mid">
        <span
          className="link dim dark-gray f6 f5-ns dib ml3 ml4-ns pointer"
          onClick={() => setState(State.EXPANDED)}
        >
          Sign in
        </span>
      </div>
    )
  }

  if (state === State.EXPANDED) {
    return (
      <div className="tr v-mid">
        <input
          className="pa2"
          placeholder="username"
          onChange={handleChange}
          value={value}
        />
        <button
          className="f6 f5-ns link ba bw1 ph3 pv2 ml3 ml4-ns dib mid-gray bg-white pointer"
          onClick={handleSubmit}
          onKeyDown={handleKeyDown}
        >
          Submit
        </button>
      </div>
    )
  }

  if (state === State.LOGGED_IN) {
    return (
      <div className="tr v-mid">
        <span className="dark-gray">Signed in as {user}</span>
        <span
          className="link dim dark-gray f6 f5-ns ml3 ml4-ns pointer"
          onClick={handleSignOut}
        >
          Sign out
        </span>
      </div>
    )
  }

  return null
}
export default Login
