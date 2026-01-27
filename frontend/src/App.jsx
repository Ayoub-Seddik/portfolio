import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Experience from "./pages/Experience";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";
import Skills from "./pages/Skills";

import AdminSkills from "./pages/admin/AdminSkills";  
import AdminResume from "./pages/admin/AdminResume";

import NotFound from "./pages/NotFound";

import { Routes, Route } from "react-router-dom";
import AdminExperienceEducation from "./pages/admin/AdminExperienceEducation";

export default function App() {
  return (
    <div className="min-h-screen text-[var(--text)] bg-gradient-to-b from-[var(--bg)] to-black">
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/contact" element={<Contact />} />

        <Route path="/admin/skills" element={<AdminSkills />} />
        <Route path="/admin/resume" element={<AdminResume />} />
        <Route path="/admin/experience" element={<AdminExperienceEducation />} />
        {/* Catch-all route for 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}