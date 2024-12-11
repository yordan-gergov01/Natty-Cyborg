import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router";

function GoogleSignUp() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const googleId = params.get("googleId");
    const email = params.get("email");
    const name = params.get("name");

    if (googleId && email) {
      axios
        .post("http://localhost:3000/auth/google/signup", {
          googleId,
          email,
          name: name || "New User",
        })
        .then((response) => {
          localStorage.setItem("jwtToken", response.data.token);
          toast.success(response.data.message);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.log("Signup failed:", error);
          toast.error("Failed to register with Google");
        });
    }
  }, [location, navigate]);

  return <div>Loading...</div>;
}

export default GoogleSignUp;
