import express from 'express'
import passport from 'passport'
import trimRequest from 'trim-request'

import '../../config/passport.js'

import { roleAuthorization } from '../controllers/auth/index.js'

import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser
} from '../controllers/users/index.js'

import {
  validateCreateUser,
  validateGetUser,
  validateUpdateUser,
  validateDeleteUser
} from '../controllers/users/users.validate.js'

const router = express.Router()

const requireAuth = passport.authenticate('jwt', { session: false })

/*
 * Users routes
 */

// Get users
router.get(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  getUsers
)

// Create user
router.post(
  '/',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateCreateUser,
  createUser
)

// Get single user
router.get(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateGetUser,
  getUser
)

// Update user
router.patch(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateUpdateUser,
  updateUser
)

// Delete user
router.delete(
  '/:id',
  requireAuth,
  roleAuthorization(['admin']),
  trimRequest.all,
  validateDeleteUser,
  deleteUser
)

export default router
