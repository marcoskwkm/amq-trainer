import knex from 'knex'

export default knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    connectionString: process.env.DATABASE_URL,
    database: 'amq-trainer',
    ssl: {
      rejectUnauthorized: false,
    },
  },
})
