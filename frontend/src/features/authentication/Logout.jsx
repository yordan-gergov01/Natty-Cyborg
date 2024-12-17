import { HiArrowRightOnRectangle } from "react-icons/hi2";
import { useNavigate } from "react-router";

function Logout() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("userName");
    navigate("/login");
  }
  return (
    <button onClick={handleLogout}>
      <HiArrowRightOnRectangle />
    </button>
  );
}

export default Logout;
