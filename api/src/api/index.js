import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { errors } from 'celebrate'

import { ErrorHandlerMiddleware } from './middleware/ErrorMiddleware.js'

/**
 * Routes.
 */
import routes from './routes.js'

/**
 * Express instance.
 * @constant
 */
const app = express()

/**
 * Express middleware.
 */
app
  /**
   * Common middleware.
   */
  .set('trust proxy', 1)
  .use(cors())
  .use(helmet())
  .use(bodyParser.urlencoded({ extended: true, limit: '10mb' }))
  .use(bodyParser.json({ limit: '10mb', type: 'application/json' }))
  .use(errors())
  /**
   * Routes.
   * @version 1.0.0
   */
  .use('/v1', routes)
  .use(ErrorHandlerMiddleware)

/**
 * Starts the server.
 */
app.listen(4000, () => console.info('Server started on port 3000'))