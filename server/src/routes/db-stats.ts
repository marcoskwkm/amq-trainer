import { RequestHandler } from 'express'

import db from '../database'

export const dbStatsHandler: RequestHandler = async (_, res) => {
  const [animeCount, songCount] = (await Promise.all([
    db('anime').count(),
    db('songs').count(),
  ])).map(([row]) => parseInt(row.count as string))

  res.send({ animeCount, songCount })
}
