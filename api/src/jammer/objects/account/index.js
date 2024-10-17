import { AnimalJamClient } from "animaljam.js"

export class Account extends AnimalJamClient {
  /**
   * Creates an instance of Account.
   * @param {Object} options - The options.
   * @param {String} options.screen_name - The screen name.
   * @param {String} options.password - The password.
   */
  constructor ({ screen_name, password, proxy = {}, game = 'flash' } = {}) {
    super()
    
    /**
     * The account screen name.
     * @type {String}
     */
    this.screen_name = screen_name

    /**
     * The account password.
     * @type {String}
     */
    this.password = password

    /**
     * Boolean indicating if the account is connected.
     * @type {Boolean}
     */
    this._isConnected = false

    /**
     * The account connection.
     * @type {Connection}
     */
    this._connection = null

    /**
     * Interval for checking if the account is connected.
     * @type {Interval}
     */
    this._interval = null
    
    /**
     * The account proxy.
     * @type {Object}
     */
    this._proxy = proxy ?? null

    /**
     * The game type.
     * @type {String}
     */
    this._game = game
  }

  /**
   * Regex for UUID validation.
   * @param {String} message - The message.
   * @type {RegExp}
   */
  isValidUUID (message) {
    return /^[a-f0-9\-]{36}$/.test(message)
  }

  /**
   * Fetches the flash vars.
   * @returns {Promise<Object>}
   */
  async fetchFlashVars () {
    return await this.flashvars.fetch()
  }

  /**
   * Authenticates the account.
   * @returns {Promise<void>}
   */
  async authenticate () {
    const { screen_name, password } = this

    const { auth_token } = await this.authenticator.login({
      screen_name,
      password,
      domain: this._game,
      proxy: this._proxy,
    })

    if (!auth_token) throw new Error('Authentication failed')

    this.auth_token = auth_token
    console.info(`${screen_name} authenticated`)
  }
  

  /**
   * Creates a connection to the game server.
   * @returns {Promise<void>}
   */
  async createConnection ({ host, port, domain, deploy_version } = {}) {
    const { screen_name, auth_token } = this

    this._connection = await this.networking.createClient({
      screen_name,
      auth_token,
      host,
      port,
      domain,
      deploy_version,
      proxy: this._proxy
    })

    try {
      await this._connection.connect()

      this._connection
      this._isConnected = true

      this._connection.on('close', () => {
        this._isConnected = false

        /**
         * Todo: Handle re-connection to the servers.
         */
        console.info(`${screen_name} disconnected from ${host}:${port}`)
      })

      console.info(`${screen_name} connected to ${host}:${port}`)
      this.createAntiAfk()
    } catch (error) {
      console.error('Failed to connect to the game server')
    }
  }

  /**
   * Stops the clients from disconnecting from the game server.
   * @returns {Promise<void>}
   */
  createAntiAfk () {
    const intervael = setInterval(() => {
      if (!this._isConnected) {
        clearInterval(intervael)
      }

      this.sendMessage('%xt%o%qat%4640562%treasure_1%0%')
    }, 4000)
  }

  /**
   * Waits for a message.
   * @param {String} prefix - The prefix.
   * @returns {Promise<String>} The message.
   */
  waitForMessage ({ prefix, ms = 1500 } = {}) {
    return new Promise((resolve) => {
      if (!this._isConnected) throw new Error('Not connected')

      /**
       * The listener.
       */
      const listener = (message) => {
        const { type } = message

        if (type === prefix) {
          clearTimeout(timeout)
          this._connection.removeListener('message', listener)
          resolve(message.toMessage())
        }
      }

      this._connection.on('message', listener)

      const timeout = setTimeout(() => {
        this._connection.removeListener('message', listener)
        resolve(null)
      }, ms)
    })
  }

  /**
   * Requests a masterpiece search.
   * @param {Object} data - The data.
   * @param {String} data.username - The username.
   * @returns {Promise<string>} The masterpiece search.
   */
  searchMasterpieceByUsername ({ username, game }) {
    return new Promise(async (resolve, reject) => {
      const [, masterpieces] = await Promise.all([
        this.sendMessage(`%xt%o%${game === 'flash' ? 'dmi' : 'dMl'}%0%${username}%`),
        this.waitForMessage({ prefix: game === 'flash' ? 'dmi' : 'dMl' }),
      ])

      if (!masterpieces) return reject(new Error('No masterpieces found'))

      const response = masterpieces.split('%')
        .filter(message => this.isValidUUID(message))
        .map(uuid => game === 'flash' ? `https://ajcontent.akamaized.net/masterpieces/${uuid}` : `https://ajpw-ugc-prod.akamaized.net/masterpieces/${uuid}`)

      resolve({ masterpieces: response })
    })
  }

  /**
   * Encodes a masterpiece.
   * @param {Object} data - The data.
   * @param {String} data.file - The file.
   * @param {String} data.output - The output.
   * @returns {Promise<string>} The masterpiece.
   */
  encodeMasterpiece ({ file, username }) {
    return new Promise(async (resolve, reject) => {
      const [, uuid] = await Promise.all([
        this.sendMessage(`%xt%o%ag%0%${username}%1%`),
        this.waitForMessage({ prefix: 'ag' }),
      ])

      
      if (!uuid) return reject(new Error('UUID not found'))
      
      const userUUID = uuid.split('%').find(part => this.isValidUUID(part))

      try {
        const buffer = await this.masterpiece.encode({
          imagePath: file,
          uuid: userUUID,
        })


        resolve({ buffer })
      } catch (error) {
        return reject(error)
      }
    })
  }

  /**
   * Sends a message to the game server.
   * @param {String} message - The message.
   * @returns {Promise<Number>} The number of bytes sent.
   */
  sendMessage (message) {
    if (!this._isConnected) throw new Error('Not connected')
    return this._connection.sendRawMessage(message)
  }
}
