import { useNavigate } from "react-router";

function useMoveBack() {
  const navigate = useNavigate();
  return () => navigate(-1);
}

export default useMoveBack;
