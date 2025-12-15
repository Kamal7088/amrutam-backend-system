const pool = require("../config/db");

module.exports = async (userId, action, entity) => {
  await pool.query(
    "INSERT INTO audit_logs(user_id, action, entity) VALUES ($1,$2,$3)",
    [userId, action, entity]
  );
};
