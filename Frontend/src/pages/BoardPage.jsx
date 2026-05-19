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
  const [cardStats, setCardStats] = useState(null);
  const [localCards, setLocalCards] = useState([]);
  const navigate = useNavigate();

  const loadLocalCards = () => {
    const saved = window.localStorage.getItem("kanban_dashboard_cards");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        console.log("Loaded local cards:", parsed);
        setLocalCards(parsed);
      } catch (error) {
        console.error("Failed to parse local dashboard cards", error);
        setLocalCards([]);
      }
    } else {
      console.log("No local cards found in storage");
      setLocalCards([]);
    }
  };

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
        console.log("Fetched boards:", data);
        setBoards(data);
      }
    } catch (error) {
      console.error("Error fetching boards:", error);
    }
  };

  const fetchCardStats = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/cards/stats`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched card stats:", data);
        console.log("Card stats structure:", {
          total: data.total,
          ended: data.ended,
          running: data.running,
          pending: data.pending,
        });
        setCardStats(data.stats);
      } else {
        console.warn("Card stats response not OK:", response.status);
      }
    } catch (error) {
      console.error("Error fetching card stats:", error);
    }
  };

  const getCardStatus = (card) => {
    if (card.status) {
      return card.status;
    }

    if (card.columnId === 1) return "done";
    if (card.columnId === 2) return "working";
    if (card.columnId === 3) return "stuck";
    return "not_started";
  };

  const localCardCounts = localCards.length
    ? localCards.reduce(
        (acc, card) => {
          acc.total++;
          const status = getCardStatus(card);

          if (status === "done" || status === "ended") acc.ended++;
          else if (
            status === "working" ||
            status === "running" ||
            status === "stuck"
          ) {
            acc.running++;
          } else {
            acc.pending++;
          }
          return acc;
        },
        { total: 0, ended: 0, running: 0, pending: 0 },
      )
    : null;

  const total = cardStats?.total ?? localCardCounts?.total ?? boards.length;

  const ended =
    cardStats?.ended ??
    localCardCounts?.ended ??
    boards.filter((b) => b.status === "done").length;

  const active =
    cardStats?.running ??
    localCardCounts?.running ??
    boards.filter((b) => b.status === "working").length;

  const upcoming =
    cardStats?.pending ??
    localCardCounts?.pending ??
    boards.filter((b) => b.status === "not_started").length;

  const endedPct = total > 0 ? (ended / total) * 100 : 0;
  const activePct = total > 0 ? (active / total) * 100 : 0;
  const upcomingPct = total > 0 ? (upcoming / total) * 100 : 0;

  // Debug: Log the calculated values
  console.log("=== RENDER ===", {
    total,
    ended,
    active,
    upcoming,
    cardStatsExists: !!cardStats,
    localCardsLength: localCards.length,
    boardsLength: boards.length,
  });

  // Increment render count

  useEffect(() => {
    loadLocalCards();
    fetchBoards();
    fetchCardStats();
  }, []);

  // Fallback: if no data after 2 seconds, use test data

  // Build conic-gradient stops (cumulative)
  const endedStop = endedPct;
  const activeStop = endedPct + activePct;

  // Donut chart calculation
  const centerX = 100;
  const centerY = 100;
  const radius = 70;
  const innerRadius = 35;

  const createDonutPath = (startPercent, endPercent, radius, innerRadius) => {
    const startAngle = (startPercent / 100) * 360 - 90;
    const endAngle = (endPercent / 100) * 360 - 90;

    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArc = endPercent - startPercent > 50 ? 1 : 0;

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4} Z`;
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
      </header>

      <main className="board-main">
        <section className="stats-row">
          <div className="stat-box">
            <div className="stat-title">Total tasks</div>
            <div className="stat-value">{total}</div>
          </div>
          <div className="stat-box">
            <div className="stat-title">Ended tasks</div>
            <div className="stat-value">{ended}</div>
          </div>
          <div className="stat-box">
            <div className="stat-title">Running tasks</div>
            <div className="stat-value">{active}</div>
          </div>
          <div className="stat-box">
            <div className="stat-title">Pending tasks</div>
            <div className="stat-value">{upcoming}</div>
          </div>
        </section>

        <section className="progress-section">
          <svg
            viewBox="0 0 200 200"
            className="progress-chart-svg"
            width="200"
            height="200"
          >
            <defs>
              {/* Dark Purple to Medium Purple Gradient for Completed */}
              <linearGradient
                id="purpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#cbb8ff" />
                <stop offset="40%" stopColor="#9b7fff" />
                <stop offset="100%" stopColor="#5b21ff" />
              </linearGradient>
              {/* Light Purple Gradient for In Progress */}
              <linearGradient
                id="lightPurpleGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#e6d9ff" />
                <stop offset="100%" stopColor="#c9b1ff" />
              </linearGradient>
              {/* Grey Gradient for Pending */}
              <linearGradient
                id="greyGradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#d9d9d9" />
                <stop offset="100%" stopColor="#a8a8a8" />
              </linearGradient>
            </defs>
            {/* Ended/Done - Dark Purple Gradient */}
            {endedPct > 0 && (
              <path
                d={createDonutPath(0, endedPct, radius, innerRadius)}
                fill="url(#purpleGradient)"
                style={{
                  transition: "all 0.6s ease",
                }}
              />
            )}
            {/* Running/Active - Light Purple Gradient */}
            {activePct > 0 && (
              <path
                d={createDonutPath(
                  endedPct,
                  endedPct + activePct,
                  radius,
                  innerRadius,
                )}
                fill="url(#lightPurpleGradient)"
                style={{
                  transition: "all 0.6s ease",
                }}
              />
            )}
            {/* Pending - Grey Gradient */}
            {upcomingPct > 0 && (
              <path
                d={createDonutPath(
                  endedPct + activePct,
                  100,
                  radius,
                  innerRadius,
                )}
                fill="url(#greyGradient)"
                style={{
                  transition: "all 0.6s ease",
                }}
              />
            )}
            {/* If no data, show full grey circle */}
            {total === 0 && (
              <path
                d={createDonutPath(0, 100, radius, innerRadius)}
                fill="url(#greyGradient)"
                style={{
                  transition: "all 0.6s ease",
                }}
              />
            )}
            {/* Center circle for donut effect */}
            <circle cx={centerX} cy={centerY} r={innerRadius} fill="white" />
          </svg>

          <div className="progress-legend">
            <div className="legend-item">
              <span className="legend-dot completed" /> Completed ({ended})
            </div>
            <div className="legend-item">
              <span className="legend-dot inprogress" /> In Progress ({active})
            </div>
            <div className="legend-item">
              <span className="legend-dot pending" /> Pending ({upcoming})
            </div>
          </div>
        </section>

        <section className="board-list">
          {boards.map((board) => (
            <div key={board._id} className="board-item">
              {board.name || board.title}
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default BoardPage;
