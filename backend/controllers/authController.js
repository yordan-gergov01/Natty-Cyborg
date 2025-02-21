import jwt from "jsonwebtoken";
import env from "dotenv";
import bcrypt from "bcrypt";

import { findUserByEmail, createUser } from "../models/userModel";

env.config({ path: "./../frontend/.env" });

const signToken = function (id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
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

    res.status(201).json({
      status: "success",
      message: "User registered successfully.",
    });
  } catch (err) {
    console.err(err);
    res.status(500).json({
      status: "failed",
      message: "Server error",
    });
  }
};
