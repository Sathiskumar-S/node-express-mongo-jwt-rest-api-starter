import express from 'express'
import passport from 'passport'
import trimRequest from 'trim-request'

import '../../config/passport.js'

import {
  register,
  verify,
  forgotPassword,
  resetPassword,
  getRefreshToken,
  login,
  roleAuthorization
} from '../controllers/auth/index.js'

import {
  validateRegister,
  validateVerify,
  validateForgotPassword,
  validateResetPassword,
  validateLogin
} from '../controllers/auth/auth.validate.js'

const router = express.Router()

const requireAuth = passport.authenticate('jwt', { session: false })

/*
 * Auth routes
 */

// Register route
router.post('/register', trimRequest.all, validateRegister, register)

// Verify route
router.post('/verify', trimRequest.all, validateVerify, verify)

// Forgot password route
router.post('/forgot', trimRequest.all, validateForgotPassword, forgotPassword)

// Reset password route
router.post('/reset', trimRequest.all, validateResetPassword, resetPassword)

// Get new refresh token
router.get(
  '/token',
  requireAuth,
  roleAuthorization(['user', 'admin']),
  trimRequest.all,
  getRefreshToken
)

// Login route
router.post('/login', trimRequest.all, validateLogin, login)

export default router
