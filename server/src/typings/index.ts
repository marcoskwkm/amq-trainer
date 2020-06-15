export enum SongType {
  Opening = 1,
  Ending = 2,
  Insert = 3,
}

export interface Song {
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

export interface Anime {
  annId: number,
  name: string,
  songs: [Song],
}
