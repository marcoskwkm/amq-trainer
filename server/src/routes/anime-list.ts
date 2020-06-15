import { RequestHandler } from 'express'

import db from '../database'

export const animeListHandler: RequestHandler = async (_, res) => {
  const animeList = [
    ...new Set(
      (await db.select('acceptable_names').from('anime'))
        .map((row) => row.acceptable_names)
        .flat()
    ),
  ]
  res.send(animeList)
}
