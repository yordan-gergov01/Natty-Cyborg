import db from "../config/db.js";

const getAllAddedProgress = async function () {
  return await db("progress").select(
    "id",
    "user_id",
    "weight",
    db.raw(`to_char(date, 'YYYY-MM-DD') as date`)
  );
};

const getProgressByUser = async function (userId) {
  return await db("progress")
    .where({ user_id: userId })
    .select(
      "id",
      "user_id",
      "weight",
      db.raw(`to_char(date, 'YYYY-MM-DD') as date`)
    );
};

const addNewProgress = async function (data) {
  return await db("progress")
    .insert(data)
    .returning([
      "id",
      "user_id",
      "weight",
      db.raw(`to_char(date, 'YYYY-MM-DD') as date`),
    ]);
};

const updateProgress = async function (id, data) {
  return await db("progress")
    .where({ id })
    .update(data)
    .returning([
      "id",
      "user_id",
      "weight",
      db.raw(`to_char(date, 'YYYY-MM-DD') as date`),
    ]);
};

const deleteProgress = async function (id) {
  return await db("progress").where({ id }).del();
};

const getWeeklyProgress = async function (user_id) {
  return await db("progress")
    .where("user_id", user_id)
    .where("date", ">=", db.raw("NOW() - INTERVAL '7 days'"))
    .orderBy("date", "asc");
};

const getAverageWeeklyProgress = async function (user_id) {
  return await db("progress")
    .select(
      db.raw("EXTRACT(WEEK FROM date) AS week"),
      db.raw("EXTRACT(YEAR FROM date) AS year"),
      db.raw("ROUND(AVG(weight)::numeric, 2) AS average_weight")
    )
    .where({ user_id })
    .groupByRaw("EXTRACT(YEAR FROM date), EXTRACT(WEEK FROM date)")
    .orderBy(["year", "week"]);
};

export {
  addNewProgress,
  getWeeklyProgress,
  getProgressByUser,
  getAllAddedProgress,
  updateProgress,
  deleteProgress,
  getAverageWeeklyProgress,
};
