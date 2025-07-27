import City from '../../models/city.js'
import { buildErrObject } from '../../middleware/utils/index.js'

/**
 * Checks if a city already exists in database
 * @param {string} name - name of item
 * @returns {Promise<boolean>} - Resolves to false if not exists, otherwise rejects with error
 */
export const cityExists = (name = '') => {
  return new Promise((resolve, reject) => {
    City.findOne({ name }, (err, item) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }

      if (item) {
        return reject(buildErrObject(422, 'CITY_ALREADY_EXISTS'))
      }

      resolve(false)
    })
  })
}

/**
 * Checks if a city already exists excluding itself
 * @param {string} id - id of item
 * @param {string} name - name of item
 * @returns {Promise<boolean>} - Resolves to false if not exists, otherwise rejects with error
 */
export const cityExistsExcludingItself = (id = '', name = '') => {
  return new Promise((resolve, reject) => {
    City.findOne(
      {
        name,
        _id: {
          $ne: id
        }
      },
      (err, item) => {
        if (err) {
          return reject(buildErrObject(422, err.message))
        }

        if (item) {
          return reject(buildErrObject(422, 'CITY_ALREADY_EXISTS'))
        }

        resolve(false)
      }
    )
  })
}

/**
 * Gets all items from database
 * @returns {Promise<Array>} - Resolves with list of cities
 */
export const getAllItemsFromDB = () => {
  return new Promise((resolve, reject) => {
    City.find({})
      .then((items) => resolve(items))
      .catch((err) => reject(buildErrObject(422, err.message)))
  })
}
