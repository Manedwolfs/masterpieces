import { MasterpieceSearchQueue, MasterpieceEncodeQueue } from '../../../queues/index.js'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { writeFile } from 'node:fs/promises'

export class MasterpieceService {
  /**
   * Queues a masterpiece search.
   * @param {Object} params - The parameters.
   * @param {String} params.username - The username of the user.
   * @returns {Promise<Object>} The masterpiece search.
   */
  static async addMasterpieceSearchJob ({ username, game }) {
    console.log('Queueing masterpiece search job', username)
    const job = await MasterpieceSearchQueue.AddMasterpieceSearchJob({ username, game })

    const masterpiece = await job.finished()
    if (!masterpiece) throw new Error('No masterpieces found')

    const { masterpieces } = masterpiece
    return { masterpieces }
  }

  /**
   * Queues a masterpiece create job.
   * @param {Object} params - The parameters.
   * @param {Buffer} params.buffer - The buffer.
   * @param {String} params.originalname - The original name.
   * @returns {Promise<Object>} The masterpiece create.
   */
  static async addMasterpieceCreateJob ({ buffer, originalname, username, game }) {
    console.info('Queueing masterpiece create job', username)
    
    const uploadsPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', 'uploads', originalname)
    const createPath = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', 'uploads', 'create')

    // Create the uploads directory if it doesn't exist
    await writeFile(uploadsPath, buffer)

    const job = await MasterpieceEncodeQueue.AddMasterpieceEncodeJob({ 
      file: uploadsPath,
      output: createPath,
      originalname,
      username,
      game
    })

    const masterpiece = await job.finished()
    if (!masterpiece) throw new Error('Cannot create masterpiece')

    const fileName = `masterpiece-${new Date().getTime()}.ajart`
    await writeFile(`${createPath}/${fileName}`, Buffer.from(masterpiece.buffer.data))
    
    return {
      name: fileName,
      path: createPath
    }
  }
}