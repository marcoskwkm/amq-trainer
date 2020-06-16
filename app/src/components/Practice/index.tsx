import React, { useCallback, useEffect, useRef, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

import { useConfig } from '../../config'
import { SERVER_URL } from '../../constants'
import { Song } from '../../typings'
import AutocompleteInput from '../AutocompleteInput'

enum State {
  INITIAL,
  LOADING_SONG,
  GUESSING,
  ANSWERED,
}

const getSongStartTime = (songDuration: number, sampleLength: number) => {
  // Random sample
  return Math.max(songDuration - sampleLength, 0) * Math.random()
}

const Practice = () => {
  const [state, setState] = useState(State.INITIAL)
  const [song, setSong] = useState<Song | null>(null)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState('')

  const { sampleLength } = useConfig()

  const allAnimeNamesRef = useRef<string[]>([])
  const playerRef = useRef<HTMLMediaElement>(null)

  // Load anime names
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/anime-list`)
      .then((res: AxiosResponse<string[]>) => {
        allAnimeNamesRef.current = res.data
      })
  }, [])

  const loadNewSong = useCallback(() => {
    axios.get(`${SERVER_URL}/random-song`).then((res: AxiosResponse<Song>) => {
      setSong(res.data)
    })
    setGuess('')
    setState(State.LOADING_SONG)
  }, [setState])

  const handleLoadedMetadata = useCallback(() => {
    if (playerRef.current) {
      const startTime = getSongStartTime(
        playerRef.current.duration,
        sampleLength
      )
      playerRef.current.currentTime = startTime
    }
  }, [sampleLength])

  const handleOnCanPlayThrough = useCallback(() => {
    playerRef.current?.play()
    setState(State.GUESSING)
  }, [playerRef])

  const handleGuessChange = useCallback(
    (value: string) => {
      setGuess(value)
    },
    [setGuess]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        event.key !== 'Enter' ||
        (state !== State.GUESSING && state !== State.ANSWERED)
      ) {
        return
      }

      if (state === State.ANSWERED) {
        loadNewSong()
      } else if (guess.length > 0) {
        if (
          song!.answers
            .map((answer) => answer.toLowerCase())
            .includes(guess.toLowerCase())
        ) {
          setResult('Correct!')
        } else {
          setResult('Incorrect.')
          console.log(song!.answers)
        }
        setState(State.ANSWERED)
      }
    },
    [song, state, guess, loadNewSong]
  )

  if (state === State.INITIAL) {
    return (
      <button type="button" onClick={loadNewSong}>
        Play a random song!
      </button>
    )
  }

  return (
    song && (
      <div>
        <p>Name: {song.name}</p>
        <p>Artist: {song.artist}</p>
        <p>{song.type}</p>
        <div>
          <audio
            ref={playerRef}
            src={song.url}
            onLoadedMetadata={handleLoadedMetadata}
            onCanPlayThrough={handleOnCanPlayThrough}
          />
        </div>
        {state === State.LOADING_SONG && <p>Loading...</p>}
        <AutocompleteInput
          value={guess}
          onChange={handleGuessChange}
          onKeyDown={handleKeyDown}
        />
        <button type="button" onClick={loadNewSong}>
          New song
        </button>
        {state === State.ANSWERED && (
          <>
            <p>{result}</p>
            <p>Answer: {song.answer}</p>
          </>
        )}
      </div>
    )
  )
}

export default Practice
