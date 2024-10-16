import { rateLimit } from 'express-rate-limit'

/**
 * Global Rate limit.
 * @constant
 */
export const GlobalRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 25,
  message: 'Too many requests from this IP, please try again after 5 minutes',
  keyGenerator: request => request.ip.replace(/:\d+[^:]*$/, '')
})