import { celebrate, Joi, Segments } from "celebrate"

/**
 * Search validation.
 * @constant
 */
export const UsernameValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string()
      .pattern(/^[a-zA-Z0-9]+$/) 
      .pattern(/^[^%]+$/)
      .min(1)
      .max(20)
      .required()
      .not(null)
      .messages({
        'string.pattern.empty': 'Username is required',
        'string.pattern.base': 'Username can only contain alphanumeric characters.',
        'string.min.base': 'Username must be at least 1 character long.',
      }),
    game: Joi.string()
      .valid('flash', 'mobile')
      .required()
      .not(null)
      .messages({
        'string.valid.base': 'Game type is required',
        'string.valid.empty': 'Game type is required',
      }),
  }),
})
