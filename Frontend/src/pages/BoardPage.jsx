import React from "react";
import "./BoardPage.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";

function BoardPage() {
  const boards = [1, 2, 3, 4, 5, 6]; // Example board data

  return (
    <div className="board-page-container">
      <header className="board-header">
        <span>KANBAN APP</span>
        <button>Log Out</button>
      </header>
      <div className="create-board-container">
        <button className="create-board-button">Create Board</button>
      </div>
      <h2>Your Boards</h2>
      <div className="board-list">
        {boards.map((board, index) => (
          <div key={index} className="board-item">
            Board title
            <button className="delete-board-button">-</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BoardPage;
