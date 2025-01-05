import { useState } from "react";

function Progress() {
  const [weightEntries, setWeightEntries] = useState([]);
  return (
    <div>
      <h2>Add Your Daily Weight</h2>
      <input type="number" placeholder="Enter your weight" />
      <button type="submit">Add Weight</button>
    </div>
  );
}

export default Progress;
