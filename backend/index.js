import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();
const port = 3000;
const saltRounds = 10;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "natty-cyborg",
  password: "Yordangergov2001",
  port: 5432,
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (checkResult.rows.length > 0) {
      res
        .status(400)
        .json({ message: "Email already exists. Try logging in." });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error with hashing:", err);
        } else {
          const newUser = await db.query(
            "INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
            [name, email, hash]
          );
          console.log(newUser);
          res.status(201).json({ message: "User registered successfully." });
        }
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/login", async (req, res) => {
  const { email, loginPassword } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(loginPassword, user.password);

      if (validPassword) {
        const token = jwt.sign({ id: user.id }, "secretKey", {
          expiresIn: "1h",
        });
        res.json({ token, message: "Login succesful." });
      } else {
        res.status(401).json({ message: "Invalid password." });
      }
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error." });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
