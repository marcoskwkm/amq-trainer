import { Song, SongType } from '../typings'

export const getSongTypeLabel = (song: Song) => song.type === SongType.Insert
  ? SongType[song.type]
  : `${SongType[song.type]} ${song.number}`
