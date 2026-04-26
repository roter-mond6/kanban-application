import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrashAlt,
  faCheckCircle,
  faClock,
  faExclamationTriangle,
  faCircleDot,
  faCalendar,
  faBars,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "../components/Sidebar";
import { API_BASE_URL } from "../api";

function DashboardPage() {
  const navigate = useNavigate();
  const [boardTitle, setBoardTitle] = useState("Board title");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [boards, setBoards] = useState([]);

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

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

  const [columns, setColumns] = useState([
    { id: 1, title: "Done", color: "done", icon: faCheckCircle },
    { id: 2, title: "Working on it", color: "working", icon: faClock },
    { id: 3, title: "Stuck", color: "stuck", icon: faExclamationTriangle },
    { id: 4, title: "Not Started", color: "not-started", icon: faCircleDot },
  ]);

  const [cards, setCards] = useState([
    {
      id: 1,
      columnId: 1,
      title: "Title",
      description: "Small Description...",
      difficulty: "Easy",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 2,
      columnId: 2,
      title: "Title",
      description: "Small Description...",
      difficulty: "Medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 3,
      columnId: 3,
      title: "Title",
      description: "Small Description...",
      difficulty: "Hard",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 4,
      columnId: 4,
      title: "Title",
      description: "Small Description...",
      difficulty: "Easy",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const handleBack = () => {
    navigate("/board/1");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCardFocus = (cardId, field, placeholder) => {
    // This function can be used for focus-related logic if needed
  };

  const handleBoardTitleChange = (value) => {
    setBoardTitle(value);
  };

  const handleBoardTitleFocus = () => {
    if (boardTitle === "Board title") {
      setBoardTitle("");
    }
  };

  const handleAddCard = (columnId) => {
    const now = new Date();
    const newCard = {
      id: Date.now(),
      columnId: columnId, // Associate the card with the column
      title: "New Title",
      description: "New Description...",
      difficulty: "Easy",
      createdAt: now,
      updatedAt: now,
    };
    setCards([...cards, newCard]);
  };
  const handleDeleteCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const handleDescriptionChange = (cardId, newDescription) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? { ...card, description: newDescription, updatedAt: new Date() }
          : card,
      ),
    );
  };

  const handleTitleChange = (cardId, newTitle) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? { ...card, title: newTitle, updatedAt: new Date() }
          : card,
      ),
    );
  };

  const handleDifficultyChange = (cardId, newDifficulty) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? { ...card, difficulty: newDifficulty, updatedAt: new Date() }
          : card,
      ),
    );
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        boards={boards}
      />
      <header className="dashboard-header">
        <button
          className="menu-toggle-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>
        <input
          type="text"
          className="board-title-input"
          value={boardTitle}
          placeholder="Board title"
          onFocus={handleBoardTitleFocus}
          onChange={(e) => handleBoardTitleChange(e.target.value)}
        />
        <button onClick={handleLogout}>Log Out</button>
      </header>
      <div className="board-columns">
        {columns.map((column) => (
          <div key={column.id} className="column">
            <div className="column-header">
              <div className={`column-title-pill ${column.color}`}>
                <FontAwesomeIcon
                  icon={column.icon}
                  className="column-title-icon"
                />
                {column.title}
              </div>
              <button
                className="add-card-button"
                onClick={() => handleAddCard(column.id)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
            <div className="column-content">
              {cards
                .filter((card) => card.columnId === column.id) // Filter cards by columnId
                .map((card) => (
                  <div key={card.id} className="card">
                    <input
                      className="card-title-input"
                      value={card.title}
                      placeholder="Title"
                      onFocus={() => handleCardFocus(card.id, "title", "Title")}
                      onChange={(e) =>
                        handleTitleChange(card.id, e.target.value)
                      }
                    />
                    <textarea
                      className="card-description"
                      value={card.description}
                      placeholder="Small Description..."
                      onFocus={() =>
                        handleCardFocus(
                          card.id,
                          "description",
                          "Small Description...",
                        )
                      }
                      onChange={(e) =>
                        handleDescriptionChange(card.id, e.target.value)
                      }
                    />
                    <div className="card-controls">
                      <select
                        className={`card-difficulty ${card.difficulty.toLowerCase()}`}
                        value={card.difficulty}
                        onChange={(e) =>
                          handleDifficultyChange(card.id, e.target.value)
                        }
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                      <span className="card-date">
                        <FontAwesomeIcon icon={faCalendar} />{" "}
                        {formatDate(card.updatedAt || card.createdAt)}
                      </span>
                    </div>
                    <button
                      className="card-delete"
                      onClick={() => handleDeleteCard(card.id)}
                    >
                      <FontAwesomeIcon icon={faTrashAlt} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
