import { useEffect, useState } from "react";
import axios from "axios";

function Progress({ userId }) {
  const [progressData, setProgressData] = useState([]);
  const [averageWeight, setAverageWeight] = useState(0);
  const [weight, setWeight] = useState("");

  useEffect(() => {
    async function fetchProgress() {
      try {
        const response = await axios.get(`/progress/weekly/${userId}`);
        setProgressData(response.data.data);
        setAverageWeight(response.data.average);
      } catch (err) {
        console.error("Error fetching weekly progress:", err);
      }
    }
    fetchProgress();
  }, [userId]);

  async function handleWeight() {
    try {
      await axios.post("http://localhost:3000/progress/add", {
        user_id: userId,
        weight: weight,
        date: new Date().toISOString().split("T")[0],
      });
      setWeight("");
      window.location.reload();
    } catch (err) {
      console.error("Error handling weight:", err);
    }
  }

  return (
    <div>
      <h2>Weekly Progress</h2>
      <input
        type="number"
        placeholder="Enter your weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <button onClick={handleWeight}>Add Weight</button>

      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {progressData?.length > 0 ? (
            progressData.map((entry) => (
              <tr key={entry.date}>
                <td>{entry.date}</td>
                <td>{entry.weight} kg</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No progress data available.</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <th> Weekly Average Weight (7 days)</th>
            <th>{averageWeight} kg</th>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default Progress;
