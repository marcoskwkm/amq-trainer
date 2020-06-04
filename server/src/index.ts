import cors from 'cors'
import express from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'
import knex from 'knex'

import { setupGraphQL } from './graphql'

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

app.post('/updateSongs', (req, res) => {
  if (!req.files) {
    res.send('no file sent')
    return
  }

  // TODO: validate format
  const songList = JSON.parse((req.files.songlist as UploadedFile).data.toString())

  console.log(songList)
  res.send('ok')
})

app.listen(3001)

;(async () => {
  const users = await pg.select('*').from('users')
  console.log(users)
})()
