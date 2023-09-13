import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import { Login } from "./login";
import ProtectedRoutes from "./Routes/ProtectedRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoutes />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
