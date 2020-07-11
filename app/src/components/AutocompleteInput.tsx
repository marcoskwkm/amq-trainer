import React, { useEffect, useRef, useState } from 'react'
import axios, { AxiosResponse } from 'axios'
import Autosuggest from 'react-autosuggest'

import './AutocompleteInput.css'
import { SERVER_URL } from '../constants'

interface AutocompleteInputProps {
  value: string
  onChange: (event: any, { newValue }: { newValue: string }) => void
  onKeyDown: (event: React.KeyboardEvent) => void
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  value,
  onChange,
  onKeyDown,
}) => {
  const [suggestions, setSuggestions] = useState<string[]>([])

  const animeListRef = useRef<string[]>([])

  // Load anime list
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/anime-list`)
      .then((res: AxiosResponse<string[]>) => {
        animeListRef.current = res.data
      })
  }, [])

  const getSuggestionValue = (suggestion: string) => suggestion

  const renderSuggestion = (suggestion: string) => (
    <div className="pa1">{suggestion}</div>
  )

  const handleSuggestionsFetchRequested = ({ value }: { value: string }) => {
    const filteredSuggestions =
      value.trim().length > 0
        ? animeListRef.current
            .filter((name) =>
              name.toLowerCase().includes(value.trim().toLowerCase())
            )
            .sort()
        : []

    setSuggestions(filteredSuggestions)
  }

  const handleSuggestionsClearRequested = () => setSuggestions([])

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={handleSuggestionsFetchRequested}
      onSuggestionsClearRequested={handleSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={{
        onChange,
        onKeyDown,
        value,
        className: 'pa1 w-100',
      }}
    />
  )
}

export default AutocompleteInput
