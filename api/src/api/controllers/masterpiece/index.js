import { MasterpieceService } from '../../services/index.js'

export class MasterpiecesController {
  /**
   * Masterpieces controller.
   * @param {Request} request - The request.
   * @param {Response} response - The response.
   * @param {NextFunction} next - The next function.
   * @returns {Promise<void>}
   */
  static async masterpieces (request, response, next) {
    try {
      const { username, game } = request.body

      const masterpieces = await MasterpieceService.addMasterpieceSearchJob({ username, game })
      return response.json(masterpieces)
    } catch (error) {
      response.status(500).json({ message: 'This user has no masterpieces' })
    }
  }

  /**
   * Creates a masterpiece.
   * @param {Request} request - The request.
   * @param {Response} response - The response.
   * @param {NextFunction} next - The next function.
   * @returns {Promise<void>}
   */
  static async masterpieceCreate (request, response, next) {
    const { originalname, buffer } = request.file
    const { username } = request.body

    try {
      if (!buffer) throw new Error('No file found')

      const { name, path } = await MasterpieceService.addMasterpieceCreateJob({
        buffer,
        originalname,
        username,
        game: 'flash'
      })

      response.setHeader('Content-disposition', 'attachment; filename=' + name)
      response.setHeader('Content-type', '.ajart')
      response.status(200).sendFile(name, {
        root: path
      })
    } catch (error) {
      response.status(500).json({ message: 'Failed to upload file' })
    }
  }
}