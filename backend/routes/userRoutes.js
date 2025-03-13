import express from "express";
import passport from "../config/passport";

import {
  getUsers,
  getOneUser,
  updateOneUser,
  deleteOneUser,
} from "../controllers/userController";

import {
  register,
  login,
  logout,
  googleCallback,
  protect,
  restrictTo,
} from "../controllers/authController";

const userRouter = express.Router();

router.post("/signup", register);
router.post("/login", login);
router.get("/logout", logout);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
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
