import { Route, Routes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoute";
import Home from "../screens/home";

const MainLayoutRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
};

export default MainLayoutRoutes;
