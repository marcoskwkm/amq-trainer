import React from 'react'

import { useUserContext } from '../context/UserContext'

const LearnNewAnime = () => {
  const { user } = useUserContext()

  if (!user) {
    return (
      <div>Please login first to add new anime to your learning queue.</div>
    )
  }

  return <div>Mirai zura!</div>
}

export default LearnNewAnime
