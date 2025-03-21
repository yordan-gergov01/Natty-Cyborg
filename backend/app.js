import express from "express";
import cors from "cors";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import passport from "passport";
import session from "express-session";

import AppError from "./utils/AppError.js";
import { globalErrorHandler } from "./controllers/errorController.js";
import { userRouter } from "./routes/userRoutes.js";
import { progressRouter } from "./routes/progressRoutes.js";

const app = express();

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET, POST",
    credentials: true,
  })
);
app.use(helmet());
app.use(xss());
app.use(hpp());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use(
  session({
    secret: process.env.MY_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", limiter);
app.use("/api/users", userRouter);
app.use("/api/progress", progressRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

app.use(globalErrorHandler);

export { app };
