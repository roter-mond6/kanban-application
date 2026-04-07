import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

function DashboardPage() {
  const navigate = useNavigate();

  const [columns, setColumns] = useState([
    { id: 1, title: "Done", color: "done" },
    { id: 2, title: "Working on it", color: "working" },
    { id: 3, title: "Stuck", color: "stuck" },
    { id: 4, title: "Not Started", color: "not-started" },
  ]);

  const [cards, setCards] = useState([
    { id: 1, columnId: 1, title: "Title", description: "Small Description..." },
    { id: 2, columnId: 2, title: "Title", description: "Small Description..." },
    { id: 3, columnId: 3, title: "Title", description: "Small Description..." },
  ]);

  const handleLogout = () => {
    navigate("/login");
  };

  const handleAddCard = (columnId) => {
    const newCard = {
      id: Date.now(),
      columnId: columnId, // Associate the card with the column
      title: "New Title",
      description: "New Description...",
    };
    setCards([...cards, newCard]);
  };
  const handleDeleteCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const handleDescriptionChange = (cardId, newDescription) => {
    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId ? { ...card, description: newDescription } : card
      )
    );
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <button onClick={() => navigate(-1)}>Back</button>
        <h1 className="board-title">Board title</h1>
        <button onClick={handleLogout}>Log Out</button>
      </header>
      <div className="board-columns">
        {columns.map((column) => (
          <div key={column.id} className="column">
            <div className={`column-header ${column.color}`}>
              {column.title}
            </div>
            {cards
              .filter((card) => card.columnId === column.id) // Filter cards by columnId
              .map((card) => (
                <div key={card.id} className="card">
                  <div className="card-title">{card.title}</div>
                  <textarea
                    className="card-description"
                    value={card.description}
                    onChange={(e) =>
                      handleDescriptionChange(card.id, e.target.value)
                    }
                  />
                  <button
                    className="card-delete"
                    onClick={() => handleDeleteCard(card.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              ))}
            <div className="column-footer">
              <button
                className="add-card-button"
                onClick={() => handleAddCard(column.id)}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              <button className="delete-column-button">
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DashboardPage;
