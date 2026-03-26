import React, { useEffect, useState } from "react";
import "./Dashboard.css";

function DashboardPage() {
  const [boards, setBoards] = useState([]);
  const [newBoardName, setNewBoardName] = useState("");

  useEffect(() => {
    // Fetch boards from the API
    fetch("http://localhost:5001/boards", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setBoards(data))
      .catch((err) => console.error(err));
  }, []);

  const handleCreateBoard = (e) => {
    e.preventDefault();
    fetch("http://localhost:5001/boards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ name: newBoardName }),
    })
      .then((res) => res.json())
      .then((data) => {
        setBoards((prevBoards) => [...prevBoards, data.board]);
        setNewBoardName("");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="dashboard-container">
      <h1>Your Boards</h1>
      <form onSubmit={handleCreateBoard}>
        <input
          type="text"
          placeholder="New Board Name"
          value={newBoardName}
          onChange={(e) => setNewBoardName(e.target.value)}
          required
        />
        <button type="submit">Create Board</button>
      </form>
      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <a href={`/board/${board.id}`}>{board.name}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DashboardPage;
