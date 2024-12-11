import { useEffect } from "react";
import { useNavigate } from "react-router";

function GoogleSignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
      setTimeout(() => {
        navigate("/dashboard");
      }, 100);
    } else {
      navigate("/intro");
    }
  }, [navigate]);
  return <div>Loading...</div>;
}

export default GoogleSignIn;
