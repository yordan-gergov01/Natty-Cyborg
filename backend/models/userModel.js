import db from "../config/db.js";
import bcrypt from "bcrypt";

const getAllUsers = async function () {
  return await db("users").select("*");
};

const findUserByEmail = async function (email) {
  return await db("users").where({ email }).first();
};

const findUserById = async function (id) {
  return await db("users").where({ id }).first();
};

const createUser = async function (name, email, password, role = "user") {
  const saltRounds = parseInt(process.env.SALT_ROUNDS || 10);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  return await db("users")
    .insert({
      name,
      email,
      password: hashedPassword,
      role,
    })
    .returning("*");
};

const updateUser = async function (id, updatedData) {
  return await db("users").where({ id }).update(updatedData).returning("*");
};

const deleteUser = async function (id) {
  return await db("users").where({ id }).del();
};

const findOrCreateGoogleUser = async function (profile) {
  let user = await db("users").where({ google_id: profile.id }).first();

  if (!user) {
    [user] = await db("users")
      .insert({
        google_id: profile.id,
        email: profile.email,
        name: profile.given_name,
      })
      .returning("*");
  }
  return user;
};

export {
  findUserByEmail,
  createUser,
  findOrCreateGoogleUser,
  findUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};
