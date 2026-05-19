import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTimes,
  faHome,
  faFolderOpen,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../api";
import "./Sidebar.css";

function Sidebar({ isOpen, onClose, boards = [] }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleHome = () => {
    navigate("/boards");
    onClose();
  };

  const handleProjectsSection = () => {
    navigate("/dashboard");
    onClose();
  };

  const handleProjectClick = (boardId) => {
    navigate(`/board/${boardId}`);
    onClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose}></div>}

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Top Section */}
        <div className="sidebar-top">
          {/* Profile Picture and Close Button */}
          <div className="sidebar-header">
            <button className="sidebar-close-btn" onClick={onClose}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="sidebar-nav">
            <button className="sidebar-nav-item" onClick={handleHome}>
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span>Home</span>
            </button>

            {/* Projects Section */}
            <div className="sidebar-projects-section">
              <div className="projects-header" onClick={handleProjectsSection}>
                <FontAwesomeIcon icon={faFolderOpen} className="nav-icon" />
                <span>Projects</span>
              </div>
              <div className="projects-list"></div>
            </div>
          </nav>
        </div>

        {/* Bottom Section - Logout Button */}
        <div className="sidebar-bottom">
          <button className="logout-button" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
