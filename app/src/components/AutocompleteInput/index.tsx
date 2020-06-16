import React, { Fragment, useEffect, useRef, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

import './AutocompleteInput.css'
import { SERVER_URL } from '../../constants'

interface AutocompleteInputProps {
  value: string
  onChange: (value: string) => void
  onKeyDown: (event: React.KeyboardEvent) => void
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  onKeyDown,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false)
  const [activeSuggestion, setActiveSuggestion] = useState<number | null>(null)

  const animeListRef = useRef<string[]>([])

  // Load anime list
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/anime-list`)
      .then((res: AxiosResponse<string[]>) => {
        animeListRef.current = res.data
      })
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value

    const filteredSuggestions =
      value.trim().length > 0
        ? animeListRef.current.filter((name) =>
            name.toLowerCase().includes(value.trim().toLowerCase())
          )
        : []

    setSuggestions(filteredSuggestions)
    setShowSuggestions(filteredSuggestions.length > 0)
    onChange(value)
  }

  const handleClick = (event: React.MouseEvent) => {
    setShowSuggestions(false)
    setActiveSuggestion(null)
    onChange((event.currentTarget as any).innerText)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!showSuggestions) {
      onKeyDown(event)
      return
    }

    if (event.key === 'Enter') {
      setShowSuggestions(false)
      setActiveSuggestion(null)
      if (activeSuggestion) {
        onChange(suggestions[activeSuggestion])
      } else {
        onKeyDown(event)
      }
    } else if (event.key === 'ArrowUp') {
      if (activeSuggestion && activeSuggestion > 0) {
        onChange(suggestions[activeSuggestion - 1])
        setActiveSuggestion(activeSuggestion - 1)
      }
    } else if (event.key === 'ArrowDown') {
      if (activeSuggestion === null) {
        onChange(suggestions[0])
        setActiveSuggestion(0)
      } else if (activeSuggestion < suggestions.length - 1) {
        onChange(suggestions[activeSuggestion + 1])
        setActiveSuggestion(activeSuggestion + 1)
      }
    }
  }

  return (
    <Fragment>
      <input
        style={{ width: '500px' }}
        type="text"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        value={value}
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((suggestion, index) => (
            <li
              className={
                index === activeSuggestion ? 'suggestion-active' : undefined
              }
              key={suggestion}
              onClick={handleClick}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </Fragment>
  )
}

export default AutocompleteInput
