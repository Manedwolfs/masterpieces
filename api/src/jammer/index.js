import { Account } from './objects/account/index.js'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import _ from 'lodash'

export class Jammer {
  static accounts = new Map()

  /**
   * Sends a request to the game server.
   * @param {Object} data - The data.
   * @returns {Promise<void>}
   */
  static async request (data) {
    const type = data.type
    const game = data.game
    
    /**
     * Gets a random account from the accounts.
     * @type {Account}
     */
    const account = this.accounts.get(game)
    if (!account) return console.log('No account found')

    switch (type) {
      case 'masterpieceSearch':
        return account.searchMasterpieceByUsername(data)
      case 'masterpieceEncode':
        return account.encodeMasterpiece(data)
      default:
        throw new Error(`Unknown request type: ${type}`)
    }
  }

  /**
   * Loads the accounts.
   * @returns {Promise<void>}
   */
  static async loadAccounts () {
    try {
      const { default: accounts } = await import(resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', 'accounts.json'), {
        with: { type: "json" }
      })

      const accountPromises = accounts.map(async ({ game, screen_name, password, proxy }) => {
        const account = new Account({
          screen_name,
          password,
          proxy: {
            ...proxy,
          },
          game: game.type
        })
        
        await account.authenticate()

        /**
         * Creates a connection to the game server.
         */
        await account.createConnection({
          host: game.smartfoxServer,
          port: game.smartfoxPort,
          domain: game.type,
          deploy_version: game.deploy_version
        })
        
        this.accounts.set(game.type, account)
      })

      await Promise.all(accountPromises)
      console.log(`Loaded ${this.accounts.size} accounts`)
    } catch (error) {
      console.error('Failed to load accounts', error)
      process.exit(1)
    }
  }
}