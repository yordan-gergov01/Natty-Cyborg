import { useEffect } from "react";
import { useNavigate } from "react-router";

function GoogleSignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const name = params.get("name");

    if (token) {
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("userName", name);
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } else {
      navigate("/intro");
    }
  }, [navigate]);
  return <div>Loading...</div>;
}

export default GoogleSignIn;
