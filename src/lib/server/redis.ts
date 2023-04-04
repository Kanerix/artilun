import { REDIS_URL } from '$env/static/private'
import { createClient } from 'redis'

const redis = createClient({
	url: REDIS_URL
})

await redis.connect()

export default redis