import { validateResult } from '../../middleware/utils/index.js'
import validator from 'validator'
import { check } from 'express-validator'

/**
 * Validates create new item request
 */
export const validateCreateUser = [
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
    
  check('role')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .isIn(['user', 'admin'])
    .withMessage('USER_NOT_IN_KNOWN_ROLE'),
    
  check('phone')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    
  check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    
  check('country')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
    
  check('urlTwitter')
    .optional()
    .custom((v) => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
    
  check('urlGitHub')
    .optional()
    .custom((v) => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),

  (req, res, next) => {
    validateResult(req, res, next)
  }
]

/**
 * Validates delete item request
 */
export const validateDeleteUser = [
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

/**
 * Validates get item request
 */
export const validateGetUser = [
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

/**
 * Validates update item request
 */
export const validateUpdateUser = [
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
    .withMessage('IS_EMPTY'),
  check('role')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY'),
  check('phone')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('city')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('country')
    .exists()
    .withMessage('MISSING')
    .not()
    .isEmpty()
    .withMessage('IS_EMPTY')
    .trim(),
  check('urlTwitter')
    .optional()
    .custom((v) => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
  check('urlGitHub')
    .optional()
    .custom((v) => (v === '' ? true : validator.isURL(v)))
    .withMessage('NOT_A_VALID_URL'),
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
