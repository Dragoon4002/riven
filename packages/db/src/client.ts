import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

let _db: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (!_db) {
    const url = process.env['NEON_DATABASE_URL']
    if (!url) throw new Error('NEON_DATABASE_URL is not set')
    _db = drizzle(neon(url), { schema })
  }
  return _db
}

export const db: ReturnType<typeof drizzle> = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_t, prop) { return Reflect.get(getDb(), prop) },
})

export type DB = typeof db