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

//entri baru di tabel sesi poto
async function startSession(userId, filterUsed) {
  const result = await pool.query(
    "INSERT INTO photo_sessions (user_id, date_time_start, filter_used, number_of_photos) VALUES ($1, NOW(), $2, 0) RETURNING *",
    [userId, filterUsed]
  );
  return result.rows[0];
}

//update waktu selesai sesi
async function endSession(sessionId) {
  const result = await pool.query(
    "UPDATE photo_sessions SET date_time_end = NOW() WHERE session_id = $1 RETURNING *",
    [sessionId]
  );
  return result.rows[0];
}

//nambah jumlah foto dalam sesi
async function incrementPhotoCount(sessionId) {
  const result = await pool.query(
    "UPDATE photo_sessions SET number_of_photos = number_of_photos + 1 WHERE session_id = $1 RETURNING *",
    [sessionId]
  );
  return result.rows[0];
}

//nyimpen detail photo yg dah di up ke cloud storage
async function savePhotoAsset(sessionId, assetUrl, mediaType) {
  const result = await pool.query(
    "INSERT INTO photo_assets (session_id, url_file_storage, media_type, upload_date) VALUES ($1, $2, $3, NOW()) RETURNING *",
    [sessionId, assetUrl, mediaType]
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
  incrementPhotoCount,
  savePhotoAsset,
};
