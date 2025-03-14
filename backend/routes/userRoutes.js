import express from "express";
import passport from "../config/passport.js";

import {
  getUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} from "../controllers/userController.js";

import {
  register,
  login,
  logout,
  googleCallback,
  protect,
  restrictTo,
} from "../controllers/authController.js";

const userRouter = express.Router();

userRouter.post("/signup", register);
userRouter.post("/login", login);
userRouter.get("/logout", logout);

userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  googleCallback
);

userRouter.use(protect);

// only admin have accessed for them after this middleware
userRouter.use(restrictTo("admin"));

userRouter.route("/").get(getUsers);

userRouter
  .route("/:id")
  .get(getOneUser)
  .patch(updateOneUser)
  .delete(deleteOneUser);

export { userRouter };
