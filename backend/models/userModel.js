import db from "../config/db";

const findUserByEmail = async function (email) {
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (err) {
    console.log("User with this email cannot be found:", err);
  }
};

const createUser = async function (name, email, password) {
  const result = await db.query(
    "INSERT INTO user (name, email, password) VALUES ($1, $2, $3) RETURNING *",
    [name, email, password]
  );
  return result.rows[0];
};

export { findUserByEmail, createUser };
