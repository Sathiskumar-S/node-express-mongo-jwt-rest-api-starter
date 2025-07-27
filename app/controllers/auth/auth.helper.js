// import { addHours } from 'date-fns'
// import {
//     buildErrObject,
//     itemNotFound,
//     getIP,
//     getBrowserInfo,
//     getCountry,
//     buildSuccObject,
// } from '../../middleware/utils/index.js'
// import User from '../../models/user.js'
// import ForgotPassword from '../../models/forgotPassword.js'
// import jwt from 'jsonwebtoken'
// import { encrypt, decrypt } from '../../middleware/auth/index.js'
// import { v4 as uuidv4 } from 'uuid'
// import UserAccess from '../../models/userAccess.js'


// const LOGIN_ATTEMPTS = 5

// /**
//  * Checks that login attempts are greater than specified in constant and also that blockexpires is less than now
//  * @param {Object} user - user object
//  */
// export const blockIsExpired = ({ loginAttempts = 0, blockExpires = '' }) =>
//     loginAttempts > LOGIN_ATTEMPTS && blockExpires <= new Date()

// const HOURS_TO_BLOCK = 2

// /**
//  * Blocks a user by setting blockExpires to the specified date based on constant HOURS_TO_BLOCK
//  * @param {Object} user - user object
//  */
// export const blockUser = (user = {}) => {
//     return new Promise((resolve, reject) => {
//         user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
//         user.save((err, result) => {
//             if (err) {
//                 return reject(buildErrObject(422, err.message))
//             }
//             if (result) {
//                 return resolve(buildErrObject(409, 'BLOCKED_USER'))
//             }
//         })
//     })
// }

// /**
//  * Checks if the user’s block has expired and resets login attempts if so.
//  * @param {Object} user - user object.
//  * @returns {Promise<boolean>}
//  */
// export const checkLoginAttemptsAndBlockExpires = (user = {}) => {
//     return new Promise((resolve, reject) => {
//         if (blockIsExpired(user)) {
//             user.loginAttempts = 0
//             user.save((err, result) => {
//                 if (err) {
//                     return reject(buildErrObject(422, err.message))
//                 }
//                 if (result) {
//                     return resolve(true)
//                 }
//             })
//         } else {
//             // User is not blocked, proceed normally
//             resolve(true)
//         }
//     })
// }

// /**
//  * Checks if the user has one of the required roles.
//  * @param {Object} data - data object containing user id and allowed roles
//  * @param {Function} next - Express next middleware function
//  * @returns {Promise<void>}
//  */
// export const checkPermissions = async ({ id = '', roles = [] }, next) => {
//   try {
//     const result = await User.findById(id)
//     await itemNotFound(null, result, 'USER_NOT_FOUND')
//     if (roles.includes(result.role)) {
//       return next()
//     }
//     throw buildErrObject(401, 'UNAUTHORIZED')
//   } catch (err) {
//     throw err
//   }
// }


// /**
//  * Checks if a forgot password verification exists
//  * @param {string} id - verification id
//  * @returns {Promise<Object>} - returns the forgot password item if found and not used
//  */
// export const findForgotPassword = async (id = '') => {
//   try {
//     const item = await ForgotPassword.findOne({
//       verification: id,
//       used: false
//     })

//     await itemNotFound(null, item, 'NOT_FOUND_OR_ALREADY_USED')
//     return item
//   } catch (err) {
//     throw err
//   }
// }

// /**
//  * Finds user by email
//  * @param {string} email - user's email
//  * @returns {Promise<Object>} - user object if found
//  */
// export const findUser = async (email = '') => {
//   try {
//     const item = await User.findOne(
//       { email },
//       'password loginAttempts blockExpires name email role verified verification'
//     )

//     await itemNotFound(null, item, 'USER_DOES_NOT_EXIST')
//     return item
//   } catch (err) {
//     throw err
//   }
// }


// /**
//  * Finds user by ID
//  * @param {string} userId - user's ID
//  * @returns {Promise<Object>} - user object if found
//  */
// export const findUserById = async (userId = '') => {
//   try {
//     const item = await User.findById(userId)
//     await itemNotFound(null, item, 'USER_DOES_NOT_EXIST')
//     return item
//   } catch (err) {
//     throw err
//   }
// }


// /**
//  * Finds user by email to reset password
//  * @param {string} email - user email
//  * @returns {Promise<Object>} - resolved user if found
//  */
// export const findUserToResetPassword = async (email = '') => {
//   try {
//     const user = await User.findOne({ email })
//     await itemNotFound(null, user, 'NOT_FOUND')
//     return user
//   } catch (err) {
//     throw err
//   }
// }


// /**
//  * Builds an object with created forgot password object,
//  * if env is development or testing exposes the verification
//  * @param {Object} item - created forgot password object
//  * @returns {Object} - response object with optional verification field
//  */
// export const forgotPasswordResponse = ({ email = '', verification = '' }) => {
//     let data = {
//         msg: 'RESET_EMAIL_SENT',
//         email
//     }

//     if (process.env.NODE_ENV !== 'production') {
//         data = {
//             ...data,
//             verification
//         }
//     }

//     return data
// }

// /**
//  * Generates a token
//  * @param {Object|string} user - user ID or object with _id
//  * @returns {string} - encrypted JWT token
//  */
// export const generateToken = (user = '') => {
//     try {
//         const expiration =
//             Math.floor(Date.now() / 1000) +
//             60 * Number(process.env.JWT_EXPIRATION_IN_MINUTES)

//         const token = jwt.sign(
//             {
//                 data: {
//                     _id: user
//                 },
//                 exp: expiration
//             },
//             process.env.JWT_SECRET
//         )

//         return encrypt(token)
//     } catch (error) {
//         throw error
//     }
// }

// /**
//  * Gets user id from token
//  * @param {string} token - Encrypted and encoded token
//  * @returns {Promise<string>} user id
//  */
// export const getUserIdFromToken = (token = '') => {
//     return new Promise((resolve, reject) => {
//         try {
//             const decryptedToken = decrypt(token)
//             jwt.verify(decryptedToken, process.env.JWT_SECRET, (err, decoded) => {
//                 if (err) {
//                     return reject(buildErrObject(409, 'BAD_TOKEN'))
//                 }
//                 resolve(decoded.data._id)
//             })
//         } catch (err) {
//             reject(buildErrObject(409, 'BAD_TOKEN'))
//         }
//     })
// }

// /**
//  * Marks a request to reset password as used
//  * @param {Object} req - request object
//  * @param {Object} forgot - forgot object (Mongoose document)
//  * @returns {Promise<Object>} - Success object
//  */
// export const markResetPasswordAsUsed = (req = {}, forgot = {}) => {
//     return new Promise((resolve, reject) => {
//         forgot.used = true
//         forgot.ipChanged = getIP(req)
//         forgot.browserChanged = getBrowserInfo(req)
//         forgot.countryChanged = getCountry(req)

//         forgot.save(async (err, item) => {
//             try {
//                 await itemNotFound(err, item, 'NOT_FOUND')
//                 resolve(buildSuccObject('PASSWORD_CHANGED'))
//             } catch (error) {
//                 reject(error)
//             }
//         })
//     })
// }

// /**
//  * Adds one attempt to loginAttempts, then compares loginAttempts with the constant LOGIN_ATTEMPTS,
//  * if it's less returns wrong password, else returns blockUser function
//  * @param {Object} user - user object
//  * @returns {Promise<Object>} - Either error or blocked user
//  */
// export const passwordsDoNotMatch = async (user = {}) => {
//   try {
//     user.loginAttempts += 1
//     await saveLoginAttemptsToDB(user)

//     if (user.loginAttempts <= LOGIN_ATTEMPTS) {
//       throw buildErrObject(409, 'WRONG_PASSWORD')
//     }

//     return await blockUser(user)
//   } catch (error) {
//     throw error
//   }
// }

// /**
//  * Registers a new user in the database
//  * @param {Object} req - request object
//  * @returns {Promise<Object>} - Created user object
//  */
// export const registerUser = async (req = {}) => {
//   try {
//     const user = new User({
//       name: req.name,
//       email: req.email,
//       password: req.password,
//       verification: uuidv4()
//     })

//     const savedUser = await user.save()
//     return savedUser
//   } catch (err) {
//     throw buildErrObject(422, err.message)
//   }
// }

// /**
//  * Builds the registration token
//  * @param {Object} item - user object that contains created id
//  * @param {Object} userInfo - user object
//  * @returns {Promise<Object>} - Object containing token and user info
//  */
// export const returnRegisterToken = (
//   { _id = '', verification = '' },
//   userInfo = {}
// ) => {
//   return new Promise((resolve) => {
//     if (process.env.NODE_ENV !== 'production') {
//       userInfo.verification = verification
//     }
//     const data = {
//       token: generateToken(_id),
//       user: userInfo
//     }
//     resolve(data)
//   })
// }

// /**
//  * Creates a new password forgot
//  * @param {Object} req - request object
//  * @returns {Promise<Object>} - The created ForgotPassword document
//  */
// export const saveForgotPassword = (req = {}) => {
//   return new Promise((resolve, reject) => {
//     const forgot = new ForgotPassword({
//       email: req.body.email,
//       verification: uuidv4(),
//       ipRequest: getIP(req),
//       browserRequest: getBrowserInfo(req),
//       countryRequest: getCountry(req)
//     })

//     forgot.save((err, item) => {
//       if (err) {
//         return reject(buildErrObject(422, err.message))
//       }
//       resolve(item)
//     })
//   })
// }

// /**
//  * Saves login attempts to database
//  * @param {Object} user - user object
//  * @returns {Promise<boolean>} - Resolves true if save succeeds
//  */
// export const saveLoginAttemptsToDB = (user = {}) => {
//   return new Promise((resolve, reject) => {
//     user.save((err, result) => {
//       if (err) {
//         return reject(buildErrObject(422, err.message))
//       }
//       if (result) {
//         resolve(true)
//       }
//     })
//   })
// }

// /**
//  * Saves a new user access and then returns token
//  * @param {Object} req - request object
//  * @param {Object} user - user object
//  * @returns {Promise<Object>} - Token and user info
//  */
// export const saveUserAccessAndReturnToken = (req = {}, user = {}) => {
//   return new Promise((resolve, reject) => {
//     const userAccess = new UserAccess({
//       email: user.email,
//       ip: getIP(req),
//       browser: getBrowserInfo(req),
//       country: getCountry(req)
//     })

//     userAccess.save(async (err) => {
//       try {
//         if (err) {
//           return reject(buildErrObject(422, err.message))
//         }
//         const userInfo = await setUserInfo(user)
//         resolve({
//           token: generateToken(user._id),
//           user: userInfo
//         })
//       } catch (error) {
//         reject(error)
//       }
//     })
//   })
// }

// /**
//  * Creates an object with user info
//  * @param {Object} req - request object
//  * @returns {Promise<Object>} - user info object
//  */
// export const setUserInfo = (req = {}) => {
//   return new Promise((resolve) => {
//     let user = {
//       _id: req._id,
//       name: req.name,
//       email: req.email,
//       role: req.role,
//       verified: req.verified
//     }

//     // Adds verification for testing purposes
//     if (process.env.NODE_ENV !== 'production') {
//       user = {
//         ...user,
//         verification: req.verification
//       }
//     }

//     resolve(user)
//   })
// }

// /**
//  * Updates a user password in database
//  * @param {string} password - new password
//  * @param {Object} user - user object
//  * @returns {Promise<Object>} - updated user object
//  */
// export const updatePassword = (password = '', user = {}) => {
//   return new Promise((resolve, reject) => {
//     user.password = password
//     user.save(async (err, item) => {
//       try {
//         await itemNotFound(err, item, 'NOT_FOUND')
//         resolve(item)
//       } catch (error) {
//         reject(error)
//       }
//     })
//   })
// }

// /**
//  * Checks if blockExpires from user is greater than now
//  * @param {Object} user - user object
//  * @returns {Promise<boolean>}
//  */
// export const userIsBlocked = (user = {}) => {
//   return new Promise((resolve, reject) => {
//     if (user.blockExpires > new Date()) {
//       return reject(buildErrObject(409, 'BLOCKED_USER'))
//     }
//     resolve(true)
//   })
// }

// /**
//  * Checks if verification id exists for user
//  * @param {string} id - verification id
//  * @returns {Promise<Object>}
//  */
// export const verificationExists = async (id = '') => {
//   try {
//     const user = await User.findOne({
//       verification: id,
//       verified: false
//     })

//     await itemNotFound(null, user, 'NOT_FOUND_OR_ALREADY_VERIFIED')
//     return user
//   } catch (err) {
//     throw err
//   }
// }


// /**
//  * Verifies a user
//  * @param {Object} user - user object
//  * @returns {Promise<Object>}
//  */
// export const verifyUser = async (user = {}) => {
//   try {
//     user.verified = true
//     const updatedUser = await user.save()
//     return updatedUser
//   } catch (err) {
//     throw buildErrObject(422, err.message || err)
//   }
// }

import { addHours } from 'date-fns'
import {
  buildErrObject,
  itemNotFound,
  getIP,
  getBrowserInfo,
  getCountry,
  buildSuccObject,
} from '../../middleware/utils/index.js'
import User from '../../models/user.js'
import ForgotPassword from '../../models/forgotPassword.js'
import jwt from 'jsonwebtoken'
import { encrypt, decrypt } from '../../middleware/auth/index.js'
import { v4 as uuidv4 } from 'uuid'
import UserAccess from '../../models/userAccess.js'

const LOGIN_ATTEMPTS = 5
const HOURS_TO_BLOCK = 2

export const blockIsExpired = ({ loginAttempts = 0, blockExpires = '' }) =>
  loginAttempts > LOGIN_ATTEMPTS && blockExpires <= new Date()

export const blockUser = async (user = {}) => {
  try {
    user.blockExpires = addHours(new Date(), HOURS_TO_BLOCK)
    await user.save()
    return buildErrObject(409, 'BLOCKED_USER')
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

export const checkLoginAttemptsAndBlockExpires = async (user = {}) => {
  try {
    if (blockIsExpired(user)) {
      user.loginAttempts = 0
      await user.save()
    }
    return true
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

export const checkPermissions = async ({ id = '', roles = [] }, next) => {
  try {
    const result = await User.findById(id)
    await itemNotFound(null, result, 'USER_NOT_FOUND')
    if (roles.includes(result.role)) return next()
    throw buildErrObject(401, 'UNAUTHORIZED')
  } catch (err) {
    throw err
  }
}

export const findForgotPassword = async (id = '') => {
  const item = await ForgotPassword.findOne({ verification: id, used: false })
  await itemNotFound(null, item, 'NOT_FOUND_OR_ALREADY_USED')
  return item
}

export const findUser = async (email = '') => {
  const item = await User.findOne(
    { email },
    'password loginAttempts blockExpires name email role verified verification'
  )
  await itemNotFound(null, item, 'USER_DOES_NOT_EXIST')
  return item
}

export const findUserById = async (userId = '') => {
  const item = await User.findById(userId)
  await itemNotFound(null, item, 'USER_DOES_NOT_EXIST')
  return item
}

export const findUserToResetPassword = async (email = '') => {
  const user = await User.findOne({ email })
  await itemNotFound(null, user, 'NOT_FOUND')
  return user
}

export const forgotPasswordResponse = ({ email = '', verification = '' }) => {
  const data = {
    msg: 'RESET_EMAIL_SENT',
    email,
  }
  if (process.env.NODE_ENV !== 'production') {
    return { ...data, verification }
  }
  return data
}

export const generateToken = (user = '') => {
  const expiration =
    Math.floor(Date.now() / 1000) +
    60 * Number(process.env.JWT_EXPIRATION_IN_MINUTES)
  const token = jwt.sign(
    { data: { _id: user }, exp: expiration },
    process.env.JWT_SECRET
  )
  return encrypt(token)
}

export const getUserIdFromToken = async (token = '') => {
  try {
    const decryptedToken = decrypt(token)
    const decoded = jwt.verify(decryptedToken, process.env.JWT_SECRET)
    return decoded.data._id
  } catch {
    throw buildErrObject(409, 'BAD_TOKEN')
  }
}

export const markResetPasswordAsUsed = async (req = {}, forgot = {}) => {
  try {
    forgot.used = true
    forgot.ipChanged = getIP(req)
    forgot.browserChanged = getBrowserInfo(req)
    forgot.countryChanged = getCountry(req)
    const item = await forgot.save()
    await itemNotFound(null, item, 'NOT_FOUND')
    return buildSuccObject('PASSWORD_CHANGED')
  } catch (error) {
    throw error
  }
}

export const passwordsDoNotMatch = async (user = {}) => {
  user.loginAttempts += 1
  await saveLoginAttemptsToDB(user)
  if (user.loginAttempts <= LOGIN_ATTEMPTS) {
    throw buildErrObject(409, 'WRONG_PASSWORD')
  }
  return await blockUser(user)
}

export const registerUser = async (req = {}) => {
  try {
    const user = new User({
      name: req.name,
      email: req.email,
      password: req.password,
      verification: uuidv4(),
    })
    return await user.save()
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

export const returnRegisterToken = async (
  { _id = '', verification = '' },
  userInfo = {}
) => {
  if (process.env.NODE_ENV !== 'production') {
    userInfo.verification = verification
  }
  return {
    token: generateToken(_id),
    user: userInfo,
  }
}

export const saveForgotPassword = async (req = {}) => {
  try {
    const forgot = new ForgotPassword({
      email: req.body.email,
      verification: uuidv4(),
      ipRequest: getIP(req),
      browserRequest: getBrowserInfo(req),
      countryRequest: getCountry(req),
    })
    return await forgot.save()
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

export const saveLoginAttemptsToDB = async (user = {}) => {
  try {
    await user.save()
    return true
  } catch (err) {
    throw buildErrObject(422, err.message)
  }
}

export const saveUserAccessAndReturnToken = async (req = {}, user = {}) => {
  try {
    const userAccess = new UserAccess({
      email: user.email,
      ip: getIP(req),
      browser: getBrowserInfo(req),
      country: getCountry(req),
    })
    await userAccess.save()
    const userInfo = await setUserInfo(user)
    return {
      token: generateToken(user._id),
      user: userInfo,
    }
  } catch (err) {
    throw err
  }
}

export const setUserInfo = async (req = {}) => {
  const user = {
    _id: req._id,
    name: req.name,
    email: req.email,
    role: req.role,
    verified: req.verified,
  }
  if (process.env.NODE_ENV !== 'production') {
    user.verification = req.verification
  }
  return user
}

export const updatePassword = async (password = '', user = {}) => {
  try {
    user.password = password
    const item = await user.save()
    await itemNotFound(null, item, 'NOT_FOUND')
    return item
  } catch (err) {
    throw err
  }
}

export const userIsBlocked = async (user = {}) => {
  if (user.blockExpires > new Date()) {
    throw buildErrObject(409, 'BLOCKED_USER')
  }
  return true
}

export const verificationExists = async (id = '') => {
  const user = await User.findOne({ verification: id, verified: false })
  await itemNotFound(null, user, 'NOT_FOUND_OR_ALREADY_VERIFIED')
  return user
}

export const verifyUser = async (user = {}) => {
  try {
    user.verified = true
    return await user.save()
  } catch (err) {
    throw buildErrObject(422, err.message || err)
  }
}
