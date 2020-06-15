import cors from 'cors'
import express from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import knex from 'knex'

import { setupGraphQL } from './graphql'
import { Anime } from './interfaces'
import { getSongTypeLabel } from './utils/songs'

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

app.post('/update-songs', async (req, res) => {
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
          if (!song.examples.mp3) {
            return
          }

          await pg
            .select('*')
            .from('songs')
            .where('ann_song_id', '=', song.annSongId)
            .then(async (rows) => {
              if (rows.length === 0) {
                await pg('songs').insert({
                  ann_song_id: song.annSongId,
                  ann_anime_id: anime.annId,
                  name: song.name,
                  artist: song.artist,
                  type: song.type,
                  number: song.number,
                  url: song.examples.mp3,
                  date_added: pg.fn.now(),
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

app.get('/anime-list', async (_, res) => {
  const animeList = [
    ...new Set(
      (await pg.select('acceptable_names').from('anime'))
        .map((row) => row.acceptable_names)
        .flat()
    ),
  ]
  res.send(animeList)
})

app.get('/random-song', async (_, res) => {
  const allSongs = await pg
    .select('name', 'artist', 'type', 'number', 'url', 'ann_anime_id')
    .from('songs')

  const song = allSongs[Math.floor(allSongs.length * Math.random())]
  const [{ display_name: answer }] = await pg
    .select('display_name')
    .from('anime')
    .where('ann_id', '=', song.ann_anime_id)

  const acceptableAnswers = [
    ...new Set(
      (
        await pg
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
})

app.listen(3001)
