import db from "../config/db.js";

const getWorkoutsByUser = async function (userId) {
  return await db("workouts").where({ user_id: userId }).select("*");
};

const createWorkout = async function (data) {
  return await db("workouts").insert(data).returning("*");
};

const deleteWorkout = async function (id) {
  return await db("workouts").where({ id }).del();
};

const updateWorkout = async function (id, data) {
  return await db("workouts").where({ id }).update(data).returning("*");
};

const isWorkoutSkipped = async function (id) {
  return await db("workouts").where({ id }).returning(["is_skipped"]);
};

export {
  getWorkoutsByUser,
  createWorkout,
  deleteWorkout,
  updateWorkout,
  isWorkoutSkipped,
};
