import knex from 'knex'

const DATABASE_URL = '127.0.0.1'
const DATABASE_NAME = 'amq-trainer'

export default knex({
  client: 'pg',
  connection: {
    host: DATABASE_URL,
    database: DATABASE_NAME,
  },
})
