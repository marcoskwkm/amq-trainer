import knex from 'knex'

export default knex(
  process.env.DATABASE_URL
    ? {
        client: 'pg',
        connection: {
          connectionString: process.env.DATABASE_URL,
          ssl: {
            rejectUnauthorized: false,
          },
        },
      }
    : {
        client: 'pg',
        connection: {
          host: '127.0.0.1',
          database: 'amq-trainer',
        },
      }
)
