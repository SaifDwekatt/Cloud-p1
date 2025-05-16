// This file is for Create React App to proxy API requests during development
const { createProxyMiddleware } = require("http-proxy-middleware")

module.exports = (app) => {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:5000", // Your backend server URL
      changeOrigin: true,
      pathRewrite: {
        "^/api": "/api", // No rewrite needed if your backend uses /api
      },
      onError: (err, req, res) => {
        console.error("Proxy error:", err)
        res.writeHead(500, {
          "Content-Type": "application/json",
        })
        res.end(JSON.stringify({ message: "Proxy error: Backend server might be down" }))
      },
    }),
  )
}
