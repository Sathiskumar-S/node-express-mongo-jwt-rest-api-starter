import { validateResult } from '../../middleware/utils/index.js'
import { check } from 'express-validator'

/**
 * Validates forgot password request
 */
export const validateForgotPassword = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

/**
 * Validates login request
 */
export const validateLogin = [
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({ min: 5 })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

/**
 * Validates register request
 */
export const validateRegister = [
  check('name')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('email')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isEmail()
    .withMessage('EMAIL_IS_NOT_VALID'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({ min: 5 })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

/**
 * Validates reset password request
 */
export const validateResetPassword = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('password')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isLength({ min: 5 })
    .withMessage('PASSWORD_TOO_SHORT_MIN_5'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]

/**
 * Validates verify request
 */
export const validateVerify = [
  check('id')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  (req, res, next) => {
    validateResult(req, res, next)
  }
]


