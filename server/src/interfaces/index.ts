enum SongType {
  OPENING = 1,
  ENDING = 2,
  INSERT = 3,
}

interface Song {
  annSongId: number,
  name: string,
  type: SongType,
  number: number,
  artist: string,
  examples: {
    480?: string,
    720?: string,
    mp3?: string,
  },
}

interface Anime {
  annId: number,
  name: string,
  songs: [Song],
}
