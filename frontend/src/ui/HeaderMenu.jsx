import { useNavigate } from "react-router";
import { FaRegUser } from "react-icons/fa";

import Logout from "../features/authentication/Logout";

function HeaderMenu() {
  const navigate = useNavigate();
  return (
    <ul className="flex p-4">
      <li>
        <button onClick={() => navigate("/account")}>
          <FaRegUser />
        </button>
      </li>
      <li>
        <Logout />
      </li>
    </ul>
  );
}

export default HeaderMenu;
