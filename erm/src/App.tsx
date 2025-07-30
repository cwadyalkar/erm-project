// src/App.tsx

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginForm } from "./modules/auth/Login";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import AssignmentsPage from "./modules/dashboard/pages/AssignmentsPage";
import ProjectsPage from "./modules/dashboard/pages/ProjectsPage";
import MyProjectsPage from "./modules/dashboard/pages/MyProjectsPage";
import HomePage from "./modules/dashboard/pages/HomePage";
import EngineersPage from "./modules/dashboard/pages/EngineersPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assignments" element={<AssignmentsPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/my-projects" element={<MyProjectsPage />} />
        <Route path="/engineers" element={<EngineersPage />} />
      </Routes>
    </Router>
  );
};

export default App;
