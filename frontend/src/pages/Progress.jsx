import { useEffect, useState } from "react";

import axios from "axios";

import { jwtDecode } from "jwt-decode";

function Progress() {
  const [progressData, setProgressData] = useState([]);
  const [averageWeight, setAverageWeight] = useState(0);
  const [weight, setWeight] = useState("");

  useEffect(() => {
    async function fetchProgress() {
      try {
        const token = localStorage.getItem("jwtToken");

        if (!token) {
          console.error("No token found.");
          return;
        }

        const decoded = jwtDecode(token);
        const userId = decoded.id;

        const response = await axios.get(
          `http://localhost:3000/progress/weekly/${userId}`
        );

        const progress = response.data.data || [];
        setProgressData(progress);

        const groupedData = progress.reduce((acc, entry) => {
          const entryDate = new Date(entry.date);
          const weekStart = new Date(entryDate);
          weekStart.setDate(entryDate.getDate() - entryDate.getDay());

          const weekKey = weekStart.toISOString().split("T")[0];
          if (!acc[weekKey]) acc[weekKey] = [];
          acc[weekKey].push(entry);

          return acc;
        }, {});

        const completeWeeks = Object.values(groupedData).filter(
          (weekEntries) => weekEntries.length === 7
        );

        if (completeWeeks.length > 0) {
          const lastWeek = completeWeeks[completeWeeks.length - 1];
          const average =
            lastWeek.reduce((sum, entry) => sum + entry.weight, 0) /
            lastWeek.length;
          setAverageWeight(average.toFixed(2));
        } else {
          setAverageWeight(0);
        }
      } catch (err) {
        console.error("Error fetching weekly progress:", err);
      }
    }

    fetchProgress();
  }, []);

  async function handleWeight() {
    try {
      const token = localStorage.getItem("jwtToken");

      await axios.post(
        "http://localhost:3000/progress/add",
        {
          weight: parseFloat(weight),
          date: new Date().toISOString().split("T")[0],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setWeight("");
      window.location.reload();
    } catch (err) {
      console.error("Error handling weight:", err);
    }
  }

  return (
    <div>
      <h2>Daily Weight</h2>
      <input
        className="border border-gray-300 rounded-md px-4 py-2 w-auto focus:ring-2 focus:ring-blue-500 bg-black bg-opacity-20 text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type="number"
        placeholder="Enter your weight"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <button
        onClick={handleWeight}
        className="mt-2 ml-3 bg-blue-800 text-white px-4 py-2 rounded-md hover:bg-blue-900 transition"
      >
        Add Weight
      </button>

      <table className="table auto w-full border-collapse mt-8 border-blue-600 rounded-md shadow-sm">
        <thead className="bg-blue-800">
          <tr>
            <th className="px-4 py-2 text-center font-medium text-white">
              Date
            </th>
            <th className="px-4 py-2 text-center font-medium text-white">
              Weight
            </th>
            <th className="px-4 py-2 text-center font-medium text-white">
              Average Weight (Weekly Change)
            </th>
          </tr>
        </thead>
        <tbody>
          {progressData?.length > 0 ? (
            progressData.map((entry) => (
              <tr key={entry.id}>
                <td className="px-4 py-2 text-center">
                  {new Date(entry.date).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                  })}
                </td>
                <td className="px-4 py-2 text-center">{entry.weight} kg</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="px-4 py-2 text-center text-white">
                No progress data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="text-right font-semibold mt-4">
        {progressData?.length > 0 && `Weekly Average: ${averageWeight} kg`}
      </div>
    </div>
  );
}

export default Progress;
