import { Client } from 'redis-om'
import { env } from './env'

const redis = await new Client().open(env.REDIS_URL)

export default redis