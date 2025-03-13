// just for refference
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
