import { Router } from 'express'
import multer from 'multer'

import { MasterpiecesController } from './controllers/index.js'
import { UsernameValidation } from './validations/index.js'
import { GlobalRateLimit } from './rate-limits/index.js'

/**
 * Express routes.
 * @type {Router}
 * @constant
 */
const routes = Router()

/**
 * Multer storage.
 * @type {multer.memoryStorage}
 * @constant
 */
const storage = multer.memoryStorage()
const upload = multer({ storage })

/**
 * @route POST /masterpiece/search
 * @desc Search for masterpieces.
 * @access Public
 */
routes.post('/masterpiece/search', [UsernameValidation, GlobalRateLimit], async (request, response, next) => 
  MasterpiecesController.masterpieces(request, response, next))

/**
 * @route POST /masterpiece/create
 * @desc Create a masterpiece.
 * @access Public
 */
routes.post('/masterpiece/create', [GlobalRateLimit], upload.single('masterpiece'), async (request, response, next) =>
  MasterpiecesController.masterpieceCreate(request, response, next))

export default routes