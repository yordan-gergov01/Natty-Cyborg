import { useEffect, useState } from "react";
import axios from "axios";

function Progress() {
  const [weight, setWeight] = useState("");
  const [weightEntries, setWeightEntries] = useState([]);
  const [averageWeight, setAverageWeight] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchWeights();
    fetchAverageWeight();
  }, []);

  async function addWeight() {
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setError("No token found!");
        return;
      }
      await axios.post(
        "http://localhost:3000/user/weight",
        { weight },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWeight("");
      fetchWeights();
      fetchAverageWeight();
    } catch (err) {
      setError("Failed to add weight.");
    }
  }

  async function fetchWeights() {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get("http://localhost:3000/user/weight", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWeightEntries(response.data);
    } catch (err) {
      setError("Failed to fetch weights.");
    }
  }

  async function fetchAverageWeight() {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(
        "http://localhost:3000/user/weight/average",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAverageWeight(response.data.averageWeight);
    } catch (err) {
      setError("Failed to fetch average weight.");
    }
  }
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 text-center">Weight Tracker</h2>

      <div className="flex items-center justify-center gap-4 mb-8">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter your weight"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={addWeight}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
        >
          Add Weight
        </button>
      </div>

      <div className="overflow-x-auto">
        <h3 className="text-2xl font-semibold mb-4">Daily Weights</h3>
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 text-left">#</th>
              <th className="py-2 px-4 text-left">Date</th>
              <th className="py-2 px-4 text-left">Weight (kg)</th>
            </tr>
          </thead>
          <tbody>
            {weightEntries.length > 0 ? (
              weightEntries.map((entry, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-2 px-4">{index + 1}</td>
                  <td className="py-2 px-4">
                    {new Date(entry.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 px-4">{entry.weight}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="py-4 text-center text-gray-500">
                  No weight data available
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr className="bg-gray-100 font-semibold">
              <td colSpan="2" className="py-2 px-4">
                Weekly Average Weight
              </td>
              <td className="py-2 px-4">
                {averageWeight !== null ? (
                  <span>{averageWeight.toFixed(2)} kg</span>
                ) : (
                  "No data for the week"
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
    </div>
  );
}

export default Progress;
