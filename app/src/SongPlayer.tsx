import React, { useCallback, useRef, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

import { SERVER_URL } from './constants'
import { Song } from './typings'

enum State {
  INITIAL,
  LOADING_SONG,
  PLAYING_SONG,
}

const SongPlayer = () => {
  const [state, setState] = useState(State.INITIAL)
  const [song, setSong] = useState<Song | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const playerRef = useRef<HTMLMediaElement>(null)

  const loadNewSong = useCallback(() => {
    axios.get(`${SERVER_URL}/random_song`).then((res: AxiosResponse<Song>) => {
      setSong(res.data)
    })
    setState(State.LOADING_SONG)
    setLoading(true)
  }, [setState])

  const handleOnCanPlayThrough = useCallback(() => {
    playerRef.current?.play()
    setLoading(false)
  }, [playerRef])

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
        {loading && <p>Loading...</p>}
        <button type="button" onClick={loadNewSong}>
          New song
        </button>
      </div>
    )
  )
}

export default SongPlayer
