import { v4 as uuidv4 } from 'uuid'
import User from '../../models/user.js'
import { buildErrObject } from '../../middleware/utils/index.js'

/**
 * Creates a new item in database
 * @param {Object} req - request object
 */
export const createItemInDb = ({
  name = '',
  email = '',
  password = '',
  role = '',
  phone = '',
  city = '',
  country = ''
}) => {
  return new Promise((resolve, reject) => {
    const user = new User({
      name,
      email,
      password,
      role,
      phone,
      city,
      country,
      verification: uuidv4()
    })
    user.save((err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }

      item = JSON.parse(JSON.stringify(item))

      delete item.password
      delete item.blockExpires
      delete item.loginAttempts

      resolve(item)
    })
  })
}
