api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Only attach the token if it's an absolute URL pointing to your Render backend
    // This prevents attaching headers to local assets like manifest.json or CSS
    if (
      token &&
      config.url.startsWith("https://kanban-application-5l4z.onrender.com")
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
