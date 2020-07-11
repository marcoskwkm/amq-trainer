import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react'
import axios, { AxiosResponse } from 'axios'

import { SERVER_URL } from '../constants'
import { useConfig } from '../context/ConfigContext'
import { Song } from '../typings'
import AutocompleteInput from './AutocompleteInput'
import './Practice.css'

enum State {
  INITIAL,
  LOADING_SONG,
  GUESSING,
  ANSWERED_CORRECT,
  ANSWERED_INCORRECT,
}

interface AdditionalSongInfo {
  sampleStart: number
}

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${('00' + Math.floor(seconds - 60 * minutes)).slice(-2)}`
}

const getSongStartTime = (songDuration: number, sampleLength: number) => {
  // Random sample
  return Math.max(songDuration - sampleLength, 0) * Math.random()
}

const Practice = () => {
  const [state, setState] = useState(State.INITIAL)
  const [song, setSong] = useState<Song | null>(null)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState('Placeholder')
  const [timer, setTimer] = useState(0)
  const timerTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [additionalSongInfo, setAdditionalSongInfo] = useReducer<
    React.Reducer<AdditionalSongInfo, Partial<AdditionalSongInfo>>
  >(
    (info, newInfo) => ({
      ...info,
      ...newInfo,
    }),
    {
      sampleStart: 0,
    }
  )

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

  const stopTimer = useCallback(() => {
    if (timerTimeoutRef.current) {
      clearTimeout(timerTimeoutRef.current)
      timerTimeoutRef.current = null
    }
  }, [])

  const startTimer = () => {
    const startTimestamp = Date.now()
    const f = () => {
      // Add 1 to prevent timer from jumping from sampleLength to sampleLength - 2
      const elapsedTime = Date.now() - startTimestamp + 1
      const secondsLeft = Math.floor(sampleLength - elapsedTime / 1000)
      if (secondsLeft >= 0) {
        setTimer(secondsLeft)
        timerTimeoutRef.current = setTimeout(f, 1000)
      }
    }
    f()
  }

  const loadNewSong = useCallback(() => {
    axios.get(`${SERVER_URL}/random-song`).then((res: AxiosResponse<Song>) => {
      setSong(res.data)
    })

    stopTimer()
    setGuess('')
    setState(State.LOADING_SONG)
  }, [setGuess, setState, stopTimer])

  const handleLoadedMetadata = useCallback(() => {
    if (playerRef.current) {
      const startTime = getSongStartTime(
        playerRef.current.duration,
        sampleLength
      )

      setAdditionalSongInfo({
        sampleStart: startTime,
      })

      playerRef.current.currentTime = startTime
    }
  }, [sampleLength, setAdditionalSongInfo])

  const handleOnCanPlayThrough = () => {
    playerRef.current?.play()
    setState(State.GUESSING)
    if (!timerTimeoutRef.current) {
      startTimer()
    }
  }

  const handleGuessChange = useCallback(
    (_: any, { newValue }: { newValue: string }) => {
      setGuess(newValue)
    },
    [setGuess]
  )

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (
        event.key !== 'Enter' ||
        ![
          State.GUESSING,
          State.ANSWERED_CORRECT,
          State.ANSWERED_INCORRECT,
        ].includes(state)
      ) {
        return
      }

      if (
        state === State.ANSWERED_CORRECT ||
        state === State.ANSWERED_INCORRECT
      ) {
        loadNewSong()
      } else if (guess.length > 0) {
        if (
          song!.answers
            .map((answer) => answer.toLowerCase())
            .includes(guess.toLowerCase())
        ) {
          setResult('Correct!')
          setState(State.ANSWERED_CORRECT)
        } else {
          setResult('Incorrect.')
          setState(State.ANSWERED_INCORRECT)
          console.log(song!.answers)
        }
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
      <div className="mw7 center">
        <audio
          ref={playerRef}
          src={song.url}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlayThrough={handleOnCanPlayThrough}
        />
        <p className="f-headline mt4 mb0 tc">
          {state === State.LOADING_SONG ? 'Loading...' : timer}
        </p>
        <div className="h2">
          {(state === State.ANSWERED_CORRECT ||
            state === State.ANSWERED_INCORRECT) && (
            <p
              className={`resultText tc mv0 fw6 ${
                state === State.ANSWERED_CORRECT ? 'green' : 'red'
              }`}
            >
              {result}
            </p>
          )}
        </div>
        <div className="flex justify-between items-center">
          <div className="w-80">
            <AutocompleteInput
              value={guess}
              onChange={handleGuessChange}
              onKeyDown={handleKeyDown}
            />
          </div>
          <button type="button" onClick={loadNewSong}>
            New song
          </button>
        </div>
        {(state === State.ANSWERED_CORRECT ||
          state === State.ANSWERED_INCORRECT) && (
          <>
            <p>
              <span className="fwb">Answer:</span> {song.answer}
            </p>
            <div className="mt4">
              <p className="fwb">Song info:</p>
              <p>Name: {song.name}</p>
              <p>Artist: {song.artist}</p>
              <p>{song.type}</p>
              <p>Sample start: {formatTime(additionalSongInfo.sampleStart)}</p>
            </div>
          </>
        )}
      </div>
    )
  )
}

export default Practice
