import express from 'express'

import { setupGraphQL } from './graphql'

const app = express()

setupGraphQL(app)
app.listen(3000)

console.log('running server')
