import crypto from 'crypto'
import { buildErrObject } from '../../middleware/utils/index.js'

/**
 * Checks if password matches
 * @param {string} password - password
 * @param {Object} user - user object
 * @returns {Promise<boolean>}
 */
export const checkPassword = async (password = '', user = {}) => {
  try {
    return await user.comparePassword(password)
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

const secret = process.env.JWT_SECRET
const algorithm = 'aes-256-cbc'
// Key length is dependent on the algorithm. In this case for aes256, it is 32 bytes (256 bits).
const key = crypto.scryptSync(secret, 'salt', 32)
const iv = Buffer.alloc(16, 0) // Initialization vector

/**
 * Decrypts text
 * @param {string} text - text to decrypt
 * @returns {string|Error}
 */
export const decrypt = (text = '') => {
  const decipher = crypto.createDecipheriv(algorithm, key, iv)

  try {
    let decrypted = decipher.update(text, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    return decrypted
  } catch (err) {
    return err
  }
}

/**
 * Encrypts text
 * @param {string} text - text to encrypt
 * @returns {string}
 */
export const encrypt = (text = '') => {
  const cipher = crypto.createCipheriv(algorithm, key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  return encrypted
}


