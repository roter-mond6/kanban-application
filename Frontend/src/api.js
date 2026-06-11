// Fallback to the Render backend if env var wasn't set during build
export const API_BASE_URL =
	process.env.REACT_APP_API_URL || "https://kanban-application-5l4z.onrender.com";
