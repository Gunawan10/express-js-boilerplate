const restApi = {
  ok: (res, data, message = 'Success') =>
    res.status(200).json({ success: true, message, data }),

  created: (res, data, message = 'Created') =>
    res.status(201).json({ success: true, message, data }),

  bad: (res, message = 'Bad Request') =>
    res.status(400).json({ error: true, code: 400, message }),

  duplicated: (res, message = 'Duplicate Data') =>
    res.status(409).json({ error: true, code: 409, message }),

  notFound: (res, message = 'Not Found') =>
    res.status(404).json({ error: true, code: 404, message }),

  error: (res, message = 'Internal Server Error') =>
    res.status(500).json({ error: true, code: 500, message })
}

const Result = {
  ok: (data, message) => ({ success: 'ok', data, message }),
  created: (data, message) => ({ success: 'created', data, message }),
  bad: (message) => ({ error: 'bad', message }),
  duplicated: (message) => ({ error: 'duplicated', message }),
  notFound: (message) => ({ error: 'notFound', message })
}

const sendResponse = (res, result) => {
  const { success, error, data, message } = result

  if (error) {
    const fn = restApi[error] || restApi.error
    return fn(res, message)
  }

  const fn = restApi[success] || restApi.ok
  return fn(res, data, message)
}

module.exports = {
  Result,
  restApi,
  sendResponse
}
