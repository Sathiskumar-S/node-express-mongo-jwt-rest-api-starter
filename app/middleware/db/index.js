import { buildSuccObject, itemNotFound } from '../../middleware/utils/index.js'

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
export const buildSort = (sort = '', order = 1) => {
  const sortBy = {}
  sortBy[sort] = order
  return sortBy
}

/**
 * Checks the query string for filtering records
 * query.filter should be the text to search (string)
 * query.fields should be the fields to search into (array)
 * @param {Object} query - query object
 */
export const checkQueryString = (query = {}) => {
  return new Promise((resolve, reject) => {
    try {
      if (
        typeof query.filter !== 'undefined' &&
        typeof query.fields !== 'undefined'
      ) {
        const data = {
          $or: []
        }
        const array = []
        // Takes fields param and builds an array by splitting with ','
        const arrayFields = query.fields.split(',')
        // Adds SQL Like %word% with regex
        arrayFields.map((item) => {
          array.push({
            [item]: {
              $regex: new RegExp(query.filter, 'i')
            }
          })
        })
        // Puts array result in data
        data.$or = array
        resolve(data)
      } else {
        resolve({})
      }
    } catch (err) {
      console.log(err.message)
      reject(buildErrObject(422, 'ERROR_WITH_FILTER'))
    }
  })
}

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
export const cleanPaginationID = (result = {}) => {
  result.docs.map((element) => delete element.id)
  return result
}

/**
 * Creates a new item in database
 * @param {Object} req - request object
 * @param {Object} model - mongoose model
 * @returns {Promise<Object>} - created item
 */
export const createItem = (req = {}, model = {}) => {
  return new Promise((resolve, reject) => {
    model.create(req, (err, item) => {
      if (err) {
        reject(buildErrObject(422, err.message))
      }
      resolve(item)
    })
  })
}

/**
 * Deletes an item from database by id
 * @param {string} id - id of item
 * @param {Object} model - mongoose model
 * @returns {Promise<Object>} - success object or error
 */
export const deleteItem = (id = '', model = {}) => {
  return new Promise((resolve, reject) => {
    model.findByIdAndRemove(id, async (err, item) => {
      try {
        await itemNotFound(err, item, 'NOT_FOUND')
        resolve(buildSuccObject('DELETED'))
      } catch (error) {
        reject(error)
      }
    })
  })
}

/**
 * Gets item from database by id
 * @param {string} id - item id
 * @param {Object} model - mongoose model
 * @returns {Promise<Object>} - fetched item or error
 */
export const getItem = (id = '', model = {}) => {
  return new Promise((resolve, reject) => {
    model.findById(id, async (err, item) => {
      try {
        await itemNotFound(err, item, 'NOT_FOUND')
        resolve(item)
      } catch (error) {
        reject(error)
      }
    })
  })
}

/**
 * Gets items from database
 * @param {Object} req - request object
 * @param {Object} model - Mongoose model
 * @param {Object} query - MongoDB query object
 * @returns {Promise<Object>} - paginated list of items
 */
export const getItems = async (req = {}, model = {}, query = {}) => {
  const options = await listInitOptions(req)
  return new Promise((resolve, reject) => {
    model.paginate(query, options, (err, items) => {
      if (err) {
        return reject(buildErrObject(422, err.message))
      }
      resolve(cleanPaginationID(items))
    })
  })
}

/**
 * Builds initial options for query
 * @param {Object} req - request object (expects query object inside)
 * @returns {Promise<Object>} - options for mongoose paginate
 */
export const listInitOptions = async (req = {}) => {
  try {
    const order = req.query.order || -1
    const sort = req.query.sort || 'createdAt'
    const sortBy = buildSort(sort, order)
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 5

    const options = {
      sort: sortBy,
      lean: true,
      page,
      limit
    }

    return options
  } catch (error) {
    console.error(error.message)
    throw buildErrObject(422, 'ERROR_WITH_INIT_OPTIONS')
  }
}

/**
 * Updates an item in database by id
 * @param {string} id - item id
 * @param {Object} model - mongoose model
 * @param {Object} req - request body object
 * @returns {Promise<Object>} - updated item
 */
export const updateItem = (id = '', model = {}, req = {}) => {
  return new Promise((resolve, reject) => {
    model.findByIdAndUpdate(
      id,
      req,
      {
        new: true,
        runValidators: true
      },
      async (err, item) => {
        try {
          await itemNotFound(err, item, 'NOT_FOUND')
          resolve(item)
        } catch (error) {
          reject(error)
        }
      }
    )
  })
}


