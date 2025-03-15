// just for refference
// app.post("/progress/weight", async (req, res) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(400).json({ message: "No token provided." });
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user_id = decoded.id;

//     const { weight, date } = req.body;

//     if (!weight || !date) {
//       return res.status(400).json({ message: "Weight and date are required." });
//     }

//     const result = await db.query(
//       "INSERT INTO progress (user_id, weight, date) VALUES ($1, $2, $3) RETURNING *",
//       [user_id, weight, date]
//     );
//     res.status(201).json(result.rows[0]);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to log weight." });
//   }
// });

// app.get("/progress/weekly/:user_id", async (req, res) => {
//   const { user_id } = req.params;

//   try {
//     const result = await db.query(
//       `SELECT id, date, weight FROM progress WHERE user_id = $1 AND date >= NOW() - INTERVAL '7 days' ORDER BY date ASC`,
//       [user_id]
//     );

//     if (result.rows.length === 0) {
//       return res
//         .status(404)
//         .json({ message: "No progress data found for this user." });
//     }

//     const weights = result.rows.map((row) => parseFloat(row.weight));
//     const average =
//       weights.reduce((sum, w) => sum + w, 0) / (weights.length || 1);

//     res.json({ data: result.rows, average: average.toFixed(2) });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to fetch weekly progress." });
//   }
// });
import {
  addNewProgress,
  getProgressByUser,
  getAllAddedProgress,
  getAverageWeeklyProgress,
  updateProgress,
  deleteProgress,
} from "../models/progressModel.js";

import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

const getAllProgress = catchAsync(async function (req, res, next) {
  const progress = await getAllAddedProgress();

  res.status(200).json({
    status: "success",
    data: {
      progress,
    },
  });
});

const getOneProgress = catchAsync(async function (req, res, next) {
  const progress = await getProgressByUser(req.params.userId);

  if (!progress || progress.length === 0) {
    return next(new AppError("No progress data found for this user.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      progress,
    },
  });
});

const addWeight = catchAsync(async function (req, res, next) {
  const { user_id, weight, date } = req.body;

  if (!user_id || !weight || !date) {
    return next(new AppError("All fields are required.", 400));
  }

  if (typeof weight !== "number" || weight <= 0) {
    return next(
      new AppError("Weight must be a number, and greater than 0.", 400)
    );
  }

  const existingWeight = await getProgressByUser(user_id);

  if (existingWeight.some((entry) => entry.date === date)) {
    return next(new AppError("Entry for this date already exists.", 400));
  }

  const newEntry = await addNewProgress({
    user_id,
    weight,
    date,
  });

  res.status(200).json({
    status: "success",
    data: {
      newEntry: newEntry[0],
    },
  });
});

const updateOneProgress = catchAsync(async function (req, res, next) {
  const updatedProgress = await updateProgress(req.params.id, req.body);

  if (!updatedProgress || updatedProgress.length === 0) {
    return next(new AppError("No progress data found with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      updatedProgress: updatedProgress[0],
    },
  });
});

const deleteOneProgress = catchAsync(async function (req, res, next) {
  const deletedProgress = await deleteProgress(req.params.id);

  if (!deletedProgress || deletedProgress.length === 0) {
    return next(new AppError("No progress data found with that ID.", 404));
  }

  res.status(200).json({
    status: "success",
  });
});

const calculateWeeklyAverage = catchAsync(async function (req, res, next) {
  const userId = req.params.userId;

  if (!userId) {
    return next(new AppError("User ID is required.", 400));
  }

  const weeklyAverage = await getAverageWeeklyProgress(userId);

  if (!weeklyAverage || weeklyAverage.length === 0) {
    return next(new AppError("No progress data found for this user.", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      weeklyAverage,
    },
  });
});

export {
  getAllProgress,
  getOneProgress,
  addWeight,
  updateOneProgress,
  deleteOneProgress,
  calculateWeeklyAverage,
};
