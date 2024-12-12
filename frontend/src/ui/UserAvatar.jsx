import { useEffect, useState } from "react";

function UserAvatar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.log("Error parsing data from local storage:", err);
        localStorage.removeItem("user");
      }
    }
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex p-4">
      <span>Welcome, {user.name || "Guest"}</span>
    </div>
  );
}

export default UserAvatar;
