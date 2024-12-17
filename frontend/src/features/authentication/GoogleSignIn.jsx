import { useEffect } from "react";
import { useNavigate } from "react-router";
import Loader from "../../ui/Loader";

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
      }, 100);
    } else {
      navigate("/intro");
    }
  }, [navigate]);
  return <Loader />;
}

export default GoogleSignIn;
