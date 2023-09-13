import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../utils/utils";


const ProtectedRoutes = () => {
  const { auth } = useAuth();

  return auth ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;