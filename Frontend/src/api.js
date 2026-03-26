fetch(`${API_BASE_URL}/boards`, {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => res.json())
  .then((data) => setBoards(data))
  .catch((err) => console.error(err));
