import cors from 'cors'
import express from 'express'
import fileUpload, { UploadedFile } from 'express-fileupload'

import { setupGraphQL } from './graphql'

const app = express()

setupGraphQL(app)
app.use(cors())
app.use(fileUpload())

app.post('/updateSongs', (req, res) => {
  if (!req.files) {
    res.send('no file sent')
    return
  }

  const songList = JSON.parse((req.files.songlist as UploadedFile).data.toString())

  console.log(songList)
  res.send('ok')
})

app.listen(3001)
console.log('running server')
