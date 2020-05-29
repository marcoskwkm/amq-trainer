import { Song, SongType } from '../interfaces'

export const getSongTypeLabel = (song: Song) => song.type === SongType.Insert
  ? SongType[song.type]
  : `${SongType[song.type]} ${song.number}`
