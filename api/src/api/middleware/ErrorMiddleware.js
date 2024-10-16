import { isCelebrateError } from 'celebrate'
import _ from 'lodash'

/**
 * Gloabl error handler middleware.
 * @param {Error} e The error to be handled.
 * @param {Request} request Express request object.
 * @param {Response} response Express response object.
 * @param {Function} next Express next function.
 * @public
 */
/* eslint-disable space-before-function-paren */
export function ErrorHandlerMiddleware(e, request, response, next) {
  /**
   * Handles celebrate validation errors.
   */
  if (isCelebrateError(e)) {
    /**
     * Maps the celebrate errors.
     */
    const messages = Array.from(e.details.values()).map(
      (error) => error.message
    )

    /**
     * Throws a missing required parameters error if the validation fails.
     */
    if (messages) {
      e = {
        status: 400,
        message: 'Missing required parameters',
        info: messages
      }
    }
  }

  /**
   * If the headers have already been sent, then we can't send the error.
   */
  if (response.headersSent) return next(e)
  return response
    .status(e.status ?? 500)
    .json(_.pick(e, 'name', 'message', 'info', 'status'))
}