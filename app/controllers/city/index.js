import City from '../../models/city.js'
import { createItem, deleteItem, checkQueryString, getItems,getItem, updateItem } from '../../middleware/db/index.js'
import { handleError, isIDGood } from '../../middleware/utils/index.js'
import { matchedData } from 'express-validator'
import { cityExists, cityExistsExcludingItself, getAllItemsFromDB } from './city.helper.js'

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const createCity = async (req, res) => {
  try {
    req = matchedData(req)
    const doesCityExists = await cityExists(req.name)
    if (!doesCityExists) {
      res.status(201).json(await createItem(req, City))
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
export const deleteCity = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    res.status(200).json(await deleteItem(id, City))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getAllCities = async (req, res) => {
  try {
    res.status(200).json(await getAllItemsFromDB())
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getCities = async (req, res) => {
  try {
    const query = await checkQueryString(req.query)
    res.status(200).json(await getItems(req, City, query))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getCity = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    res.status(200).json(await getItem(id, City))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const updateCity = async (req, res) => {
  try {
    req = matchedData(req)
    const id = await isIDGood(req.id)
    const doesCityExists = await cityExistsExcludingItself(id, req.name)
    if (!doesCityExists) {
      res.status(200).json(await updateItem(id, City, req))
    }
  } catch (error) {
    handleError(res, error)
  }
}
