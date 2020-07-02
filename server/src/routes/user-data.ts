import { RequestHandler } from 'express'

import db from '../database'

export const userDataHandler: RequestHandler = async (req, res) => {
  const user = req.query.user as string

  if (!user) {
    res.status(400).send('Invalid username')
    return
  }

  const userId = await db
    .select('*')
    .from('users')
    .where('name', '=', user)
    .then(([row]) => row?.user_id as number | undefined)

  if (!userId) {
    res.status(400).send('User does not exist')
    return
  }

  const srsData = await db
    .select('ann_song_id', 'level')
    .from('srs')
    .where('user_id', '=', userId)

  res.json(srsData)
}
