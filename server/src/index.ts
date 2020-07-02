import cors from 'cors'
import express from 'express'
import fileUpload from 'express-fileupload'

const PORT = process.env.PORT || 3001

import { setupGraphQL } from './graphql'
import {
  animeListHandler,
  dbStatsHandler,
  randomSongHandler,
  updateSongsHandler,
  userDataHandler,
} from './routes'

const app = express()

setupGraphQL(app)
app.use(cors())
app.use(fileUpload())

app.get('/anime-list', animeListHandler)
app.get('/db-stats', dbStatsHandler)
app.get('/random-song', randomSongHandler)
app.get('/user-data', userDataHandler)
app.post('/update-songs', updateSongsHandler)

app.listen(PORT)
