import express from "express";

import {
  getAllProgress,
  getOneProgress,
  addWeight,
  updateOneProgress,
  deleteOneProgress,
  calculateWeeklyAverage,
} from "../controllers/progressController.js";

import { protect } from "../controllers/authController.js";

const progressRouter = express.Router();

progressRouter.use(protect);

progressRouter.route("/").get(getAllProgress).post(addWeight);

progressRouter.route("/:id").patch(updateOneProgress).delete(deleteOneProgress);

progressRouter.get("/user/:userId", getOneProgress);

progressRouter.get("/userId/weekly-average", calculateWeeklyAverage);

export { progressRouter };
