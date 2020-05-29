import { readFileSync } from 'fs'

import { Anime } from './interfaces'
import { getSongTypeLabel } from './utils/songs'

const SONG_LIST_PATH = './songlist.json'

const songList: Anime[] = JSON.parse(readFileSync(SONG_LIST_PATH, 'utf-8'))

songList.forEach(anime => {
  console.log(`Anime: ${anime.name}`)
  anime.songs.forEach(song => {
    console.log(`\tSong: ${song.name}`)
    console.log(`\tArtist: ${song.artist}`)
    console.log(`\t${getSongTypeLabel(song)}`)
    console.log('')
  })
})
