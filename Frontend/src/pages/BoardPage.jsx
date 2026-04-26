import React, { useState, useEffect } from "react";
import "./BoardPage.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import { API_BASE_URL } from "../api";

function BoardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [boards, setBoards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/boards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBoards(data);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="board-page-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        boards={boards}
      />
      <header className="board-header">
        <button
          className="menu-toggle-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <span>KANBAN APP</span>
        <button onClick={handleLogout}>Log Out</button>
      </header>
      <div className="create-board-container">
        <button className="create-board-button">Create Board</button>
      </div>
      <h2>Your Boards</h2>
      <div className="board-list">
        {boards.map((board) => (
          <div key={board._id} className="board-item">
            {board.name || board.title}
            <button className="delete-board-button">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardPage;
