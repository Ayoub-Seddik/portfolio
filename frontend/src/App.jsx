import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import Skills from "./pages/Skills";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import AdminSkills from "./pages/AdminSkills";
import AdminResume from "./pages/AdminResume";
import AdminProjects from "./pages/AdminProjects";
import AdminExperience from "./pages/AdminExperience";
import AdminEducation from "./pages/AdminEducation";

import NotFound from "./pages/NotFound";

import { Routes, Route } from "react-router-dom";
import AdminGuard from "./admin/AdminGuard";

export default function App() {
  return (
    <div className="min-h-screen text-[var(--text)] bg-[#262626]">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />

        {/* All admin routes protected */}
        <Route path="/admin" element={<AdminGuard />}>
          <Route path="login" element={<AdminLogin />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="skills" element={<AdminSkills />} />
          <Route path="resume" element={<AdminResume />} />
          <Route path="experience" element={<AdminExperience />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="educations" element={<AdminEducation />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
