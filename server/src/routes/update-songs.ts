import { RequestHandler } from 'express'
import { UploadedFile } from 'express-fileupload'

import db from '../database'
import { Anime } from '../typings'

export const updateSongsHandler: RequestHandler = async (req, res) => {
  if (!req.files) {
    res.send('no file sent')
    return
  }

  // TODO: validate format
  const songList = JSON.parse(
    (req.files.songlist as UploadedFile).data.toString()
  ) as Anime[]

  let newAnime = 0,
    newSongs = 0

  await Promise.all(
    songList.map(async (anime) => {
      await db
        .select('*')
        .from('anime')
        .where('ann_id', '=', anime.annId)
        .then(async (rows) => {
          if (rows.length === 0) {
            await db('anime').insert({
              ann_id: anime.annId,
              // TODO: get the PROPER romaji names instead of EN ones
              display_name: anime.name,
              acceptable_names: [anime.name],
            })
            newAnime += 1
          }
        })

      await Promise.all(
        anime.songs.map(async (song) => {
          if (!song.examples.mp3) {
            return
          }

          await db
            .select('*')
            .from('songs')
            .where('ann_song_id', '=', song.annSongId)
            .then(async (rows) => {
              if (rows.length === 0) {
                await db('songs').insert({
                  ann_song_id: song.annSongId,
                  ann_anime_id: anime.annId,
                  name: song.name,
                  artist: song.artist,
                  type: song.type,
                  number: song.number,
                  url: song.examples.mp3,
                  date_added: db.fn.now(),
                })
                newSongs += 1
              }
            })
        })
      )
    })
  )

  res.send(`new anime: ${newAnime}, new songs: ${newSongs}`)
}
