import Queue from 'bull'

import { Jammer } from '../../../jammer/index.js'

/**
 * Masterpiece search queue.
 * @type {Queue}
 * @constant
 */
const queue = new Queue('masterpiece-encode', {
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  limiter: {
    max: process.env.LIMITER_MAX,
    duration: process.env.LIMITER_DURATION,
    bounceBack: process.env.LIMITER_BOUNCEBACK,
  },
})

/**
 * Processes a masterpiece search.
 * @param {object} data - The data.
 * @returns 
 */
queue.process(async (job) => {
  const { file, output, username, game } = job.data

  try {
    return await Jammer.request({
      type: 'masterpieceEncode',
      file,
      output,
      username,
      game
    })
  } catch (error) {
    console.error('Failed to process masterpiece search job', error)
  }
})

export function AddMasterpieceEncodeJob (data) {
  return queue.add(data)
}