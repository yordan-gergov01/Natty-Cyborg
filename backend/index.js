import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";
import bcrypt from "bcrypt";

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
app.use(express.static("public"));
app.use(cors());

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const checkResult = await db.query(
      "SELECT * FROM natty-cyborg WHERE email = $1",
      [email]
    );

    if (checkResult.rows.length > 0) {
      res.send("Email already exists. Try logging in.");
    } else {
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
          console.log("Error with hashing:", err);
        } else {
          const newUser = await db.query(
            "INSERT INTO natty-cyborg (name, email, password) VALUES ($1, $2, $3)",
            [name, email, hash]
          );
          console.log(newUser);
        }
      });
    }
  } catch (err) {
    console.log(err);
  }
});

app.post("/login", async (req, res) => {
  const { email, loginPassword } = req.body;

  try {
    const result = await db.query(
      "SELECT * FROM natty-cyborg WHERE email = $1",
      [email]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHashedPassword = user.password;

      bcrypt.compare(loginPassword, storedHashedPassword, (err, result) => {
        if (err) {
          console.log("Error comparing passwords:", err);
        } else {
          if (result) {
            // render the home page
          } else {
            res.send("Incorrect password");
          }
        }
      });
    } else {
      res.send("User not found");
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
