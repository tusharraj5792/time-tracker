import { Routes, Route } from "react-router-dom";
import { Login } from "./login";
import MainLayoutRoutes from "./Routes/MainLayout";
function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayoutRoutes />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
