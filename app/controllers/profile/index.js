import { isIDGood, handleError, buildErrObject } from '../../middleware/utils/index.js'
import { matchedData } from 'express-validator'
import { checkPassword } from '../../middleware/auth/index.js'
import { findUser, changePasswordInDB, getProfileFromDB, updateProfileInDB } from './profile.helper.js'

/**
 * Change password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const changePassword = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    const user = await findUser(id)
    req = matchedData(req)
    const isPasswordMatch = await checkPassword(req.oldPassword, user)
    if (!isPasswordMatch) {
      return handleError(res, buildErrObject(409, 'WRONG_PASSWORD'))
    } else {
      // all ok, proceed to change password
      res.status(200).json(await changePasswordInDB(id, req))
    }
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Get profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getProfile = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    res.status(200).json(await getProfileFromDB(id))
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Update profile function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const updateProfile = async (req, res) => {
  try {
    const id = await isIDGood(req.user._id)
    req = matchedData(req)
    res.status(200).json(await updateProfileInDB(req, id))
  } catch (error) {
    handleError(res, error)
  }
}


