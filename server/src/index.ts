import cors from 'cors'
import express from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import knex from 'knex'

import { setupGraphQL } from './graphql'
import { Anime } from './interfaces'

const app = express()
const pg = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    database: 'amq-trainer',
  },
})

setupGraphQL(app)
app.use(cors())
app.use(fileUpload())

app.post('/updateSongs', async (req, res) => {
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
      await pg
        .select('*')
        .from('anime')
        .where('ann_id', '=', anime.annId)
        .then(async (rows) => {
          if (rows.length === 0) {
            await pg('anime').insert({
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
          await pg
            .select('*')
            .from('songs')
            .where('ann_song_id', '=', song.annSongId)
            .then(async (rows) => {
              if (rows.length === 0) {
                await pg('songs').insert({
                  ann_song_id: song.annSongId,
                  name: song.name,
                  artist: song.artist,
                  type: song.type,
                  number: song.number,
                  url: song.examples.mp3,
                  date_added: pg.fn.now(),
                  acceptable_ann_ids: [anime.annId],
                })
                newSongs += 1
              }
            })
        })
      )
    })
  )

  res.send(`new anime: ${newAnime}, new songs: ${newSongs}`)
})

app.listen(3001)
;(async () => {
  const users = await pg.select('*').from('users')
  console.log(users)
})()
