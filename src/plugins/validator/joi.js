const Joi = require("joi")
const { restApi } = require("../../helpers/response")
const { wrapperValidatorPlugin } = require("../../helpers/wrapper")

const applyCommonRule = (rule, config = {}) => {
  if (config.required) rule = rule.required()
  if (config.nullable) rule = rule.allow(null)
  if (config.default !== undefined) rule = rule.default(config.default)
  if (Array.isArray(config.allow)) rule = rule.allow(...config.allow)

  return rule
}

const buildField = (config = {}) => {
  let rule

  switch (config.type) {
    case "string":
      rule = Joi.string()

      if (config.trim) rule = rule.trim()
      if (config.lowercase) rule = rule.lowercase()
      if (config.uppercase) rule = rule.uppercase()
      if (config.min !== undefined) rule = rule.min(config.min)
      if (config.max !== undefined) rule = rule.max(config.max)
      if (config.pattern) rule = rule.pattern(new RegExp(config.pattern))
      break

    case "number":
      rule = Joi.number()

      if (config.min !== undefined) rule = rule.min(config.min)
      if (config.max !== undefined) rule = rule.max(config.max)
      break

    case "integer":
      rule = Joi.number().integer()

      if (config.min !== undefined) rule = rule.min(config.min)
      if (config.max !== undefined) rule = rule.max(config.max)
      break

    case "boolean":
      rule = Joi.boolean()
      break

    case "object":
      rule = buildSchema(config.schema || {})
      break

    case "array":
      rule = Joi.array().items(buildField(config.items || {}))

      if (config.min !== undefined) rule = rule.min(config.min)
      if (config.max !== undefined) rule = rule.max(config.max)
      break

    default:
      rule = Joi.any()
  }

  switch (config.format) {
    case "email":
      rule = rule.email()
      break

    case "uuid":
      rule = rule.uuid()
      break

    case "url":
      rule = rule.uri()
      break

    case "password":
      rule = rule.min(config.min || 8)
      break

    case "date":
      rule = Joi.date()
      break

    case "datetime":
      rule = Joi.date().iso()
      break

    case "phone":
      rule = rule.pattern(/^[0-9+]{10,15}$/)
      break

    case "enum":
      rule = rule.valid(...config.values)
      break
  }

  return applyCommonRule(rule, config)
}

const buildSchema = (schema = {}) => {
  const fields = {}

  for (const [key, value] of Object.entries(schema)) {
    fields[key] = buildField(value)
  }

  return Joi.object(fields)
}

const validate = (schema, source) => {
  return async (req, res, next) => {
    const validator = buildSchema(schema)

    const { error, value } = validator.validate(req[source], {
      abortEarly: false,
      stripUnknown: true
    })

    if (error) {
      return restApi.bad(res)
    }

    req[source] = value

    next()
  }
}

module.exports = wrapperValidatorPlugin({
  body: (schema) => validate(schema, "body"),
  query: (schema) => validate(schema, "query"),
  param: (schema) => validate(schema, "params")
})