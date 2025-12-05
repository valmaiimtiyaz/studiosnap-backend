const pool = require("../config/db");

async function getAllUsers() {
  const result = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
}

async function getUserByEmail(email) {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0];
}

async function addUser(data) {
  const { username, email, password } = data;
  const result = await pool.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, password]
  );
  return result.rows[0];
}

async function updateUser(id, data) {
  const { username, email, password } = data;

  if (password) {
    const result = await pool.query(
      `UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *`,
      [username, email, password, id]
    );
    return result.rows[0];
  } else {
    const result = await pool.query(
      `UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *`,
      [username, email, id]
    );
    return result.rows[0];
  }
}

async function deleteUser(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

async function startSession(userId, filterUsed) {
  const result = await pool.query(
    "INSERT INTO photo_sessions (user_id, date_time_start, filter_used, number_of_photos) VALUES ($1, NOW(), $2, 0) RETURNING *",
    [userId, filterUsed]
  );
  return result.rows[0];
}

async function endSession(sessionId) {
  const result = await pool.query(
    "UPDATE photo_sessions SET date_time_end = NOW() WHERE session_id = $1 RETURNING *",
    [sessionId]
  );
  return result.rows[0];
}

async function getAllFilters() {
  const result = await pool.query(
    "SELECT * FROM filters WHERE is_active = TRUE"
  );
  return result.rows;
}

async function saveFeedback(sessionId, rating, comment) {
  const result = await pool.query(
    "INSERT INTO feedback (session_id, rating, comment) VALUES ($1, $2, $3) RETURNING *",
    [sessionId, rating, comment]
  );
  return result.rows[0];
}

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  addUser,
  updateUser, 
  deleteUser,
  startSession,
  endSession,
  getAllFilters,
  saveFeedback,
};
