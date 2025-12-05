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