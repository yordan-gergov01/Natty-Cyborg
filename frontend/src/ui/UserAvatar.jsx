import { useEffect, useState } from "react";

function UserAvatar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const name = localStorage.getItem("userName");
    if (token && name) {
      try {
        setUser({ token, name });
      } catch (err) {
        console.log("Error parsing data from local storage:", err);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userName");
      }
    }
  }, []);

  if (!user) {
    return <div>Error: User data not found!</div>;
  }
  return (
    <div className="flex p-4">
      <span>Welcome, {user.name || "Guest"}</span>
    </div>
  );
}

export default UserAvatar;
