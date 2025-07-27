// config/passport.js
import passport from 'passport';
import { Strategy as JwtStrategy } from 'passport-jwt';
import User from '../app/models/user.js';
import { decrypt } from '../app/middleware/auth/index.js';

/**
 * Extracts token from: header, body or query
 * @param {Object} req - request object
 * @returns {string | null} token - decrypted token
 */
const jwtExtractor = (req) => {
  let token = null;

  if (req.headers?.authorization) {
    token = req.headers.authorization.replace('Bearer ', '').trim();
  } else if (req.body?.token) {
    token = req.body.token.trim();
  }

  return token ? decrypt(token) : null;
};

/**
 * Options for JWT Strategy
 */
const jwtOptions = {
  jwtFromRequest: jwtExtractor,
  secretOrKey: process.env.JWT_SECRET
};

/**
 * JWT Login Strategy
 */
const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  try {
    const user = await User.findById(payload.data._id);
    if (!user) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
});

passport.use(jwtLogin);

export default passport;

