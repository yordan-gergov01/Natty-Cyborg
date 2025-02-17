import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
import GoogleStrategy from "passport-google-oauth2";
import { rateLimit } from "express-rate-limit";
import passport from "passport";
import session from "express-session";
import helmet from "helmet";

const app = express();

// Set security HTTP headers
app.use(helmet());

env.config({ path: "../frontend/.env" });

// These two variables should be in .env file
const port = process.env.PORT;
const saltRounds = process.env.SALT_ROUNDS;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  message: "Too many login attempts, please try again later.",
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
app.use("/login", limiter);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST",
    credentials: true,
  })
);

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
  }),
  async (req, res) => {
    try {
      const user = await db.query("SELECT * FROM users WHERE google_id = $1", [
        req.user.id,
      ]);

      if (user.rows.length > 0) {
        const token = jwt.sign(
          {
            id: user.rows[0].id,
            name: user.rows[0].name,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: process.env.JWT_EXPIRES_IN,
          }
        );
        res.redirect(
          `http://localhost:5173/google-login?token=${token}&name=${user.rows[0].name}`
        );
      } else {
        res.redirect(
          `http://localhost:5173/signup-google?googleId=${req.user.id}&email=${req.user.emails[0].value}&name=${req.user.name.givenName}`
        );
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Server error." });
    }
  }
);

app.get("/progress/weekly/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await db.query(
      `SELECT id, date, weight FROM progress WHERE user_id = $1 AND date >= NOW() - INTERVAL '7 days' ORDER BY date ASC`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No progress data found for this user." });
    }

    const weights = result.rows.map((row) => parseFloat(row.weight));
    const average =
      weights.reduce((sum, w) => sum + w, 0) / (weights.length || 1);

    res.json({ data: result.rows, average: average.toFixed(2) });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to fetch weekly progress." });
  }
});

app.post("/auth/google/signup", async (req, res) => {
  const { googleId, email, name } = req.body;

  try {
    const newUser = await db.query(
      "INSERT INTO users (google_id, email, name) VALUES ($1, $2, $3) RETURNING *",
      [googleId, email, name]
    );

    const token = jwt.sign({ id: newUser.rows[0].id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });
    res.json({ token, message: "Account created successfully!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    //see for token here after register !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (checkResult.rows.length > 0) {
      res
        .status(400)
        .json({ message: "Email already exists. Try logging in." });
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error with hashing:", err);
          return;
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
    const result = await db.query(
      "SELECT * FROM users WHERE email = $1 OR google_id = $2",
      [email, email] // to ckeck this why is 2 the same variables!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];

      if (user.password) {
        const validPassword = await bcrypt.compare(
          loginPassword,
          user.password
        );

        if (validPassword) {
          const token = jwt.sign(
            { id: user.id, name: user.name },
            process.env.JWT_SECRET,
            {
              expiresIn: process.env.JWT_EXPIRES_IN,
            }
          );
          res.json({
            token,
            user: {
              name: user.name,
            },
            message: "Login successful.",
          });
        } else {
          res.status(401).json({ message: "Invalid password." });
        }
      } else {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN,
        });
        res.json({ token, message: "Login successful." });
      }
    } else {
      res.status(404).json({ message: "User not found." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error." });
  }
});

app.post("/progress/add", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(400).json({ message: "No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user_id = decoded.id;

    const { weight, date } = req.body;

    if (!weight || !date) {
      return res.status(400).json({ message: "Weight and date are required." });
    }

    const result = await db.query(
      "INSERT INTO progress (user_id, weight, date) VALUES ($1, $2, $3) RETURNING *",
      [user_id, weight, date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to log weight." });
  }
});

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log("Profile", profile);
      done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (googleId, done) => {
  try {
    const result = await db.query("SELECT * FROM users WHERE google_id = $1", [
      googleId,
    ]);
    if (result.rows.length > 0) {
      done(null, result.rows[0]);
    } else {
      done(new Error("User not found!"), null);
    }
  } catch (err) {
    done(err, null);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
