const { z } = require("zod")
const { restApi } = require("../../helpers/response")
const { wrapperValidatorPlugin } = require("../../helpers/wrapper")

const finalizeRule = (rule, config = {}) => {
  if (config.default !== undefined) {
    rule = rule.default(config.default)
  }

  if (config.nullable) {
    rule = rule.nullable()
  }

  if (!config.required && config.default === undefined) {
    rule = rule.optional()
  }

  return rule
}

const buildField = (config = {}) => {
  let rule

  switch (config.type) {
    case "string":
      rule = z.string()

      if (config.min !== undefined) rule = rule.min(config.min)
      if (config.max !== undefined) rule = rule.max(config.max)
      if (config.pattern) rule = rule.regex(new RegExp(config.pattern))
      if (config.trim) rule = rule.transform((v) => v.trim())
      if (config.lowercase) rule = rule.transform((v) => v.toLowerCase())
      if (config.uppercase) rule = rule.transform((v) => v.toUpperCase())
      break

    case "number":
      rule = z.number()

      if (config.min !== undefined) rule = rule.min(config.min)
      if (config.max !== undefined) rule = rule.max(config.max)
      break

    case "integer":
      rule = z.number().int()

      if (config.min !== undefined) rule = rule.min(config.min)
      if (config.max !== undefined) rule = rule.max(config.max)
      break

    case "boolean":
      rule = z.boolean()
      break

    case "object":
      rule = buildSchema(config.schema || {})
      break

    case "array":
      rule = z.array(buildField(config.items || {}))

      if (config.min !== undefined) rule = rule.min(config.min)
      if (config.max !== undefined) rule = rule.max(config.max)
      break

    default:
      rule = z.any()
  }

  switch (config.format) {
    case "email":
      rule = rule.email()
      break

    case "uuid":
      rule = rule.uuid()
      break

    case "url":
      rule = rule.url()
      break

    case "password":
      rule = rule.min(config.min || 8)
      break

    case "date":
      rule = z.coerce.date()
      break

    case "datetime":
      rule = rule.datetime()
      break

    case "phone":
      rule = rule.regex(/^[0-9+]{10,15}$/)
      break

    case "enum":
      rule = z.enum(config.values)
      break
  }

  return finalizeRule(rule, config)
}

const buildSchema = (schema = {}) => {
  const fields = {}

  for (const [key, value] of Object.entries(schema)) {
    fields[key] = buildField(value)
  }

  return z.object(fields)
}

const validate = (schema, source) => {
  return async (req, res, next) => {
    const validator = buildSchema(schema)

    const result = validator.safeParse(req[source])

    if (!result.success) {
      return restApi.bad(res)
    }

    req[source] = result.data

    next()
  }
}

module.exports = wrapperValidatorPlugin({
  body: (schema) => validate(schema, "body"),
  query: (schema) => validate(schema, "query"),
  param: (schema) => validate(schema, "params")
})