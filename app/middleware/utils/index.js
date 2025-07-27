import requestIp from 'request-ip';
import mongoose from 'mongoose';
import { validationResult } from 'express-validator'

/**
 * Removes extension from file
 * @param {string} file - filename
 * @returns {string} Filename without extension
 */
export const removeExtensionFromFile = (file) => {
  return file.split('.').slice(0, -1).join('.').toString();
};

/**
 * Builds error object
 * @param {number} code - error code
 * @param {string} message - error text
 */
export const buildErrObject = (code = '', message = '') => {
  return {
    code,
    message
  };
};

/**
 * Builds success object
 * @param {string} message - success text
 */
export const buildSuccObject = (message = '') => {
  return {
    msg: message
  };
};

/**
 * Gets browser info from user
 * @param {*} req - request object
 */
export const getBrowserInfo = ({ headers }) => headers['user-agent'];

/**
 * Gets country from user using CloudFlare header 'cf-ipcountry'
 * @param {*} req - request object
 */
export const getCountry = ({ headers }) =>
  headers['cf-ipcountry'] ? headers['cf-ipcountry'] : 'XX';

/**
 * Gets IP from user
 * @param {*} req - request object
 */
export const getIP = (req) => requestIp.getClientIp(req);

/**
 * Handles error by printing to console in development env and builds and sends an error response
 * @param {Object} res - response object
 * @param {Object} err - error object
 */
export const handleError = (res = {}, err = {}) => {
  // Prints error in console
  if (process.env.NODE_ENV === 'development') {
    console.log(err);
  }
  // Sends error to user
  res.status(err.code).json({
    errors: {
      msg: err.message
    }
  });
};

/**
 * Checks if given ID is good for MongoDB
 * @param {string} id - id to check
 */
export const isIDGood = async (id = '') => {
  return new Promise((resolve, reject) => {
    const goodID = mongoose.Types.ObjectId.isValid(id);
    return goodID
      ? resolve(id)
      : reject(buildErrObject(422, 'ID_MALFORMED'));
  });
};

/**
 * Item not found
 * @param {Object} err - error object
 * @param {Object} item - item result object
 * @param {string} message - message
 */
export const itemNotFound = (err = {}, item = {}, message = 'NOT_FOUND') => {
  return new Promise((resolve, reject) => {
    if (err) {
      return reject(buildErrObject(422, err.message));
    }
    if (!item) {
      return reject(buildErrObject(404, message));
    }
    resolve();
  });
};


/**
 * Builds error for validation files
 * @param {Object} req - request object
 * @param {Object} res - response object
 * @param {Object} next - next object
 */
export const validateResult = (req, res, next) => {
  try {
    validationResult(req).throw()
    if (req.body.email) {
      req.body.email = req.body.email.toLowerCase()
    }
    return next()
  } catch (err) {
    return handleError(res, buildErrObject(422, err.array()))
  }
}

