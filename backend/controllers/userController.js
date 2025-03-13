import {
  getAllUsers,
  findUserById,
  updateUser,
  deleteUser,
} from "../models/userModel";

import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

const getUsers = catchAsync(async function (req, res) {
  const users = await getAllUsers();

  res.status(200).json({
    status: "success",
    users,
  });
});

const getOneUser = catchAsync(async function (req, res, next) {
  const user = await findUserById(req.params.id);

  if (!user || user.length === 0) {
    return next(new AppError("User with this ID is not found.", 404));
  }

  res.status(200).json({
    status: "success",
    user,
  });
});

const updateOneUser = catchAsync(async function (req, res, next) {
  const updatedUser = await updateUser(req.params.id, req.body);

  if (!updatedUser || updatedUser.length === 0) {
    return next(new AppError("User with this ID is not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedUser: updatedUser[0],
    },
  });
});

const deleteOneUser = catchAsync(async function (req, res, next) {
  const deletedUser = await deleteUser(req.params.id);

  if (!deletedUser || deletedUser.length === 0) {
    return next(new AppError("User with this ID is not found.", 404));
  }

  res.status(200).json({
    status: "success",
  });
});

export { getUsers, getOneUser, updateOneUser, deleteOneUser };
