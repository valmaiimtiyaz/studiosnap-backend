const pool = require("../config/db");

// USERS
async function getAllUsers() {
  const result = await pool.query("SELECT * FROM users ORDER BY user_id ASC");
  return result.rows;
}

async function getUserById(id) {
  const result = await pool.query("SELECT * FROM users WHERE user_id = $1", [
    id,
  ]);
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
  const result = await pool.query(
    `UPDATE users
     SET username = $1, email = $2, password = $3
     WHERE user_id = $4
     RETURNING *`,
    [username, email, password, id]
  );
  return result.rows[0];
}

async function deleteUser(id) {
  const result = await pool.query(
    "DELETE FROM users WHERE user_id = $1 RETURNING *",
    [id]
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
};
