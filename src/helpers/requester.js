module.exports = (req) => ({
  user_id: req.headers["x-user-id"] || null,
  tenant_id: req.headers["x-tenant-id"] || null,
  timezone: req.headers["x-user-timezone"] || "Asia/Jakarta"
})
