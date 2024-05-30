import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Registration from "./screens/Registration";
import Login from "./screens/Login";
import Dashboard from "./screens/Dashboard";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
