import fs from "fs";
import https from "https";
import dotenv from "dotenv";

import { app } from "./app.js";

// triggered when an exception occurs in synchronous code and is not handled by try...catch
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);

  process.exit(1);
});

dotenv.config({ path: "../.env" });

const PORT = process.env.PORT || 8000;

const server = https.createServer(
  {
    key: fs.readFileSync("..certs/key.pem"),
    cert: fs.readFileSync("..certs/cert.pem"),
  },
  app
);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);

  server.close(() => {
    process.exit(1);
  });
});
