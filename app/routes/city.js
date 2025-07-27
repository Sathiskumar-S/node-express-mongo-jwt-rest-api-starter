import express from 'express'
import passport from 'passport'
import trimRequest from 'trim-request'

import '../../config/passport.js'

import { roleAuthorization } from '../controllers/auth/index.js'

import {
  getAllCities,
  getCities,
  createCity,
  getCity,
  updateCity,
  deleteCity
} from '../controllers/city/index.js'

import {
  validateCreateCity,
  validateGetCity,
  validateUpdateCity,
  validateDeleteCity
} from '../controllers/city/city.validate.js'

const router = express.Router()

const requireAuth = passport.authenticate('jwt', { session: false })

/*
 * Cities routes
 */

// Get all items (public)
router.get('/all', getAllCities)

// Get items (admin only)
router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getCities
)

// Create new item (admin only)
router.post(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateCity,
  createCity
)

// Get single item (admin only)
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetCity,
  getCity
)

// Update item (admin only)
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateUpdateCity,
  updateCity
)

// Delete item (admin only)
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateDeleteCity,
  deleteCity
)

export default router
