import db from "../config/db";

const addNewWeight = async function (user_id, weight, date) {
  return await db("progress").insert({ user_id, weight, date }).returning("*");
};

const getWeeklyProgress = async function (user_id) {
  return await db("progress")
    .where("user_id", user_id)
    .where("date", ">=", db.raw("NOW() - INTERVAL '7 days'"))
    .orderBy("date", "asc");
};

export { addNewWeight, getWeeklyProgress };
