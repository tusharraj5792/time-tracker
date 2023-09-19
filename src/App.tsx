import { Routes, Route } from "react-router-dom";
import { Login } from "./screens/login";
import MainLayoutRoutes from "./Routes/MainLayout";
import CustomFrame from "./components/CustomFrame";
function App() {
  return (
    <>
      <CustomFrame />
      <div id="main-container">
        <Routes>
          <Route path="/" element={<MainLayoutRoutes />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </>
  );
}

export default App;
