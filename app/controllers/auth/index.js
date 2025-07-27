import { matchedData } from 'express-validator'
import {
    findUser,
    forgotPasswordResponse,
    saveForgotPassword,
    getUserIdFromToken,
    findUserById,
    saveUserAccessAndReturnToken,
    userIsBlocked,
    checkLoginAttemptsAndBlockExpires,
    passwordsDoNotMatch,
    saveLoginAttemptsToDB,
    registerUser,
    setUserInfo,
    returnRegisterToken,
    findForgotPassword,
    findUserToResetPassword,
    updatePassword,
    markResetPasswordAsUsed,
    checkPermissions,
    verificationExists, 
    verifyUser
} from './auth.helper.js'
import { handleError, isIDGood } from '../../middleware/utils/index.js'
import {
    sendResetPasswordEmailMessage,
    emailExists,
    sendRegistrationEmailMessage
} from '../../middleware/emailer/index.js'
import { checkPassword } from '../../middleware/auth/index.js'

/**
 * Forgot password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const forgotPassword = async (req, res) => {
    try {
        const locale = req.getLocale()
        const data = matchedData(req)
        await findUser(data.email)
        const item = await saveForgotPassword(req)
        sendResetPasswordEmailMessage(locale, item)
        res.status(200).json(forgotPasswordResponse(item))
    } catch (error) {
        handleError(res, error)
    }
}

/**
 * Refresh token function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const getRefreshToken = async (req, res) => {
    try {
        const tokenEncrypted = req.headers.authorization
            .replace('Bearer ', '')
            .trim()

        let userId = await getUserIdFromToken(tokenEncrypted)
        userId = await isIDGood(userId)
        const user = await findUserById(userId)
        const token = await saveUserAccessAndReturnToken(req, user)

        // Removes user info from response
        delete token.user

        res.status(200).json(token)
    } catch (error) {
        handleError(res, error)
    }
}

/**
 * Login function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const login = async (req, res) => {
    try {
        const data = matchedData(req)
        console.log(data);
        const user = await findUser(data.email)
        console.log(user)
        const userisBlocked = await userIsBlocked(user)
        console.log(userisBlocked)
        const checkloginAttemptsAndBlockExpires = await checkLoginAttemptsAndBlockExpires(user)
        console.log(checkloginAttemptsAndBlockExpires)

        const isPasswordMatch = await checkPassword(data.password, user)
        console.log(isPasswordMatch);
        if (!isPasswordMatch) {
            handleError(res, await passwordsDoNotMatch(user))
        } else {
            // all ok, register access and return token
            user.loginAttempts = 0
            await saveLoginAttemptsToDB(user)
            res.status(200).json(await saveUserAccessAndReturnToken(req, user))
        }
    } catch (error) {
        handleError(res, error)
    }
}

/**
 * Register function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const register = async (req, res) => {
    try {
        // Gets locale from header 'Accept-Language'
        const locale = req.getLocale()
        const data = matchedData(req)
        const doesEmailExists = await emailExists(data.email)

        if (!doesEmailExists) {
            const item = await registerUser(data)
            const userInfo = await setUserInfo(item)
            const response = await returnRegisterToken(item, userInfo)
            sendRegistrationEmailMessage(locale, item)
            res.status(201).json(response)
        }
    } catch (error) {
        handleError(res, error)
    }
}

/**
 * Reset password function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const resetPassword = async (req, res) => {
    try {
        const data = matchedData(req)
        const forgotPassword = await findForgotPassword(data.id)
        const user = await findUserToResetPassword(forgotPassword.email)
        await updatePassword(data.password, user)
        const result = await markResetPasswordAsUsed(req, forgotPassword)
        res.status(200).json(result)
    } catch (error) {
        handleError(res, error)
    }
}

/**
 * Roles authorization function called by route
 * @param {Array} roles - roles specified on the route
 */
export const roleAuthorization = (roles) => async (req, res, next) => {
  try {
    const data = {
      id: req.user._id,
      roles
    }
    await checkPermissions(data, next)
  } catch (error) {
    handleError(res, error)
  }
}

/**
 * Verify function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
export const verify = async (req, res) => {
  try {
    req = matchedData(req)
    const user = await verificationExists(req.id)
    res.status(200).json(await verifyUser(user))
  } catch (error) {
    handleError(res, error)
  }
}

