import React, { useCallback, useRef, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

import { SERVER_URL } from './constants'
import { Song } from './typings'

enum State {
  INITIAL,
  LOADING_SONG,
  GUESSING,
  ANSWERED,
}

const SongPlayer = () => {
  const [state, setState] = useState(State.INITIAL)
  const [song, setSong] = useState<Song | null>(null)
  const [guess, setGuess] = useState('')
  const [result, setResult] = useState('')

  const playerRef = useRef<HTMLMediaElement>(null)

  const loadNewSong = useCallback(() => {
    axios.get(`${SERVER_URL}/random_song`).then((res: AxiosResponse<Song>) => {
      setSong(res.data)
    })
    setGuess('')
    setState(State.LOADING_SONG)
  }, [setState])

  const handleOnCanPlayThrough = useCallback(() => {
    playerRef.current?.play()
    setState(State.GUESSING)
  }, [playerRef])

  const handleGuessChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setGuess(event.target.value)
    },
    [setGuess]
  )

  const handleKeyPress = useCallback(
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
            onCanPlayThrough={handleOnCanPlayThrough}
          />
        </div>
        {state === State.LOADING_SONG && <p>Loading...</p>}
        <input
          value={guess}
          onChange={handleGuessChange}
          onKeyPress={handleKeyPress}
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

export default SongPlayer
