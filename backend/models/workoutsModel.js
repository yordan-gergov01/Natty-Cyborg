import db from "../config/db.js";

const getWorkoutsByUser = async function (userId) {
  return await db("workouts").where({ user_id: userId }).select("*");
};

const createWorkout = async function (userId, name) {};
