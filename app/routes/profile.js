import express from 'express'
import passport from 'passport'
import trimRequest from 'trim-request'

import '../../config/passport.js'

import { roleAuthorization } from '../controllers/auth/index.js'

import {
  getProfile,
  updateProfile,
  changePassword
} from '../controllers/profile/index.js'

import {
  validateUpdateProfile,
  validateChangePassword
} from '../controllers/profile/profile.validate.js'

const router = express.Router()

const requireAuth = passport.authenticate('jwt', { session: false })

/*
 * Profile routes
 */

// Get profile
router.get(
  '/',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getProfile
)

// Update profile
router.patch(
  '/',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateUpdateProfile,
  updateProfile
)

// Change password
router.post(
  '/changePassword',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  validateChangePassword,
  changePassword
)

export default router
