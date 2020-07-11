import React, { useEffect, useState } from 'react'
import axios, { AxiosResponse } from 'axios'

import { SERVER_URL } from '../constants'

interface DBStats {
  animeCount: number
  songCount: number
}

const Home = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [animeCount, setAnimeCount] = useState<number | null>(null)
  const [songCount, setSongCount] = useState<number | null>(null)

  // Load database stats
  useEffect(() => {
    axios.get(`${SERVER_URL}/db-stats`).then((res: AxiosResponse<DBStats>) => {
      setAnimeCount(res.data.animeCount)
      setSongCount(res.data.songCount)
      setLoading(false)
    })
  }, [])

  return (
    <div className={loading ? 'gray' : undefined}>
      <p>Database status:</p>
      <p>Anime count: {animeCount}</p>
      <p>Song count: {songCount}</p>
    </div>
  )
}

export default Home
