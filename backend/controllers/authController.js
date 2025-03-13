import jwt from "jsonwebtoken";
import env from "dotenv";
import bcrypt from "bcrypt";

import {
  findUserByEmail,
  createUser,
  findUserById,
  findOrCreateGoogleUser,
} from "../models/userModel";

env.config();

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = function (user, statusCode, res) {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(process.env.JWT_COOKIE_EXPIRES_IN) +
        7 * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.cookie("jwt", token, cookieOptions);

  // remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    user,
  });
};

const register = async function (req, res) {
  const { name, email, password } = req.body;

  try {
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(400).json({
        status: "failed",
        message: "Email already exists. Try logging in.",
      });
    }

    const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser(name, email, passwordHash);

    createSendToken(newUser[0], 201, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Signup failed.",
    });
  }
};

const login = async function (req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "failed",
        error: "Email and password are required.",
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        status: "failed",
        error: "Email is not correct.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        status: "failed",
        error: "Password is not correct.",
      });
    }
    createSendToken(user, 200, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "failed",
      message: "Login failed.",
    });
  }
};

const logout = function (req, res) {
  res.cookie("jwt", "loggedout", {
    expiresIn: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
  });
};

const googleCallback = async function (req, res) {
  try {
    const user = await findOrCreateGoogleUser({ google_id: req.user.id });

    if (user) {
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );
      return res.redirect(
        `http://localhost:5173/google-login?token=${token}&name=${user.name}`
      );
    } else {
      return res.redirect(
        `http://localhost:5173/signup-google?googleId=${req.user.id}&email=${req.user.emails[0].value}&name=${req.user.name.givenName}`
      );
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error.",
    });
  }
};

const protect = async function (req, res, next) {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split("")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return res.status(401).json({
      status: "failed",
      error: "Unauthorized - No token provided.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await findUserById(decoded.id);

    if (!currentUser) {
      return res.status(401).json({
        status: "failed",
        error: "The user belonging to this token no longer exists.",
      });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({
      status: "failed",
      error: "Unauthorized - Invalid token.",
    });
  }
};

const isLoggedIn = async function (req, res, next) {
  if (req.cookies.jwt) {
    try {
      const decoded = jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);

      const user = await findUserById(decoded.id);

      if (!user) {
        return next();
      }

      req.locals.user = user;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

const restrictTo = function (...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "failed",
        error: "You do not have permission to perform this action.",
      });
    }
    next();
  };
};

export {
  register,
  login,
  logout,
  protect,
  restrictTo,
  isLoggedIn,
  googleCallback,
};
