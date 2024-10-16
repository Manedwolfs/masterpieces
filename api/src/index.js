import dotenv from 'dotenv'
/**
 * Jammer.
 */
import { Jammer } from './jammer/index.js'

/**
 * Loads environment variables from .env file.
 */
dotenv.config();


(async () => {
  await Jammer.loadAccounts()

  await import('./api/index.js')
})()

