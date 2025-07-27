import { matchedData } from 'express-validator'
import { handleError, isIDGood } from '../../middleware/utils/index.js'
import { emailExists, sendRegistrationEmailMessage, emailExistsExcludingMyself } from '../../middleware/emailer/index.js'
import { createItemInDb } from './users.helper.js'
import User from '../../models/user.js'
import { deleteItem, getItem, getItems, checkQueryString, updateItem } from '../../middleware/db/index.js'

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const createUser = async (req, res) => {
  try {
    // Gets locale from header 'Accept-Language'
    const locale = req.getLocale()
    req = matchedData(req)
    const doesEmailExists = await emailExists(req.email)
    if (!doesEmailExists) {
      const item = await createItemInDb(req)
      sendRegistrationEmailMessage(locale, item)
      res.status(201).json(item)
    }
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const deleteUser = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    res.status(200).json(await deleteItem(id, model))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getUser = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    res.status(200).json(await getItem(id, User))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getUsers = async (req, res) => {
  try {
    const query = await checkQueryString(req.query)
    res.status(200).json(await getItems(req, User, query))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const updateUser = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    const doesEmailExists = await emailExistsExcludingMyself(id, req.email)
    if (!doesEmailExists) {
      res.status(200).json(await updateItem(id, User, req))
    }
  } catch (error) {
    handleError(res, error)
  }
}
