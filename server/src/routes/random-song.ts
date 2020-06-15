import { RequestHandler } from 'express'

import db from '../database'
import { getSongTypeLabel } from '../utils/songs'

export const randomSongHandler: RequestHandler = async (_, res) => {
  const allSongs = await db
    .select('name', 'artist', 'type', 'number', 'url', 'ann_anime_id')
    .from('songs')

  const song = allSongs[Math.floor(allSongs.length * Math.random())]
  const [{ display_name: answer }] = await db
    .select('display_name')
    .from('anime')
    .where('ann_id', '=', song.ann_anime_id)

  const acceptableAnswers = [
    ...new Set(
      (
        await db
          .select('acceptable_names')
          .from('songs')
          .join('anime', 'songs.ann_anime_id', '=', 'anime.ann_id')
          .where('name', '=', song.name)
          .where('artist', '=', song.artist)
      )
        .map((row) => row.acceptable_names)
        .flat()
    ),
  ]

  res.send({
    name: song.name,
    artist: song.artist,
    type: getSongTypeLabel(song),
    url: song.url,
    answer,
    answers: acceptableAnswers,
  })
}
