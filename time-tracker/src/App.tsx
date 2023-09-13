import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import { Login } from "./login";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
