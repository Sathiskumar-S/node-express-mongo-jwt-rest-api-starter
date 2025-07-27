import User from '../../models/user.js'
import {
  itemNotFound,
  buildErrObject,
  buildSuccObject
} from '../../middleware/utils/index.js'

/**
 * Changes password in database
 * @param {string} id - user id
 * @param {Object} req - request object
 */
export const changePasswordInDB = (id = '', req = {}) => {
  return new Promise((resolve, reject) => {
    User.findById(id, '+password', async (err, user) => {
      try {
        await itemNotFound(err, user, 'NOT_FOUND')

        // Assigns new password to user
        user.password = req.newPassword

        // Saves in DB
        user.save((error) => {
          if (error) {
            return reject(buildErrObject(422, error.message))
          }
          resolve(buildSuccObject('PASSWORD_CHANGED'))
        })
      } catch (error) {
        reject(error)
      }
    })
  })
}

/**
 * Finds user by id
 * @param {string} id - user id
 */
export const findUser = (id = '') => {
  return new Promise((resolve, reject) => {
    User.findById(id, 'password email', async (err, user) => {
      try {
        await itemNotFound(err, user, 'USER_DOES_NOT_EXIST')
        resolve(user)
      } catch (error) {
        reject(error)
      }
    })
  })
}

/**
 * Gets profile from database by id
 * @param {string} id - user id
 */
export const getProfileFromDB = (id = '') => {
  return new Promise((resolve, reject) => {
    User.findById(id, '-_id -updatedAt -createdAt', async (err, user) => {
      try {
        await itemNotFound(err, user, 'NOT_FOUND')
        resolve(user)
      } catch (error) {
        reject(error)
      }
    })
  })
}

/**
 * Updates profile in database
 * @param {Object} req - request object
 * @param {string} id - user id
 */
export const updateProfileInDB = (req = {}, id = '') => {
  return new Promise((resolve, reject) => {
    User.findByIdAndUpdate(
      id,
      req,
      {
        new: true,
        runValidators: true,
        select: '-role -_id -updatedAt -createdAt'
      },
      async (err, user) => {
        try {
          await itemNotFound(err, user, 'NOT_FOUND')
          resolve(user)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}