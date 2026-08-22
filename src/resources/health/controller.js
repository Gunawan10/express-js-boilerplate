const healthCheck = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: {
      status: "ok"
    }
  })
}

module.exports = {
  healthCheck
}
