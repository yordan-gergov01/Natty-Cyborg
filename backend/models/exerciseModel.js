import db from "../config/db.js";

const getAllExercises = async function () {
  return await db("exercises").select("*");
};

const createExercise = async function (data) {
  return await db("exercises").insert(data).returning("*");
};

const getExerciseByName = async function (name) {
  return await db("exercises").where({ name }).first();
};

const getExerciseById = async function (id) {
  return await db("exercises").where({ id }).first();
};

const deleteExercise = async function (id) {
  return await db("exercises").where({ id }).del();
};

export {
  getAllExercises,
  getExerciseById,
  createExercise,
  getExerciseByName,
  deleteExercise,
};
