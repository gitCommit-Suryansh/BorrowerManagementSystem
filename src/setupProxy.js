// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/', // You can change this to the endpoint you want to proxy
    createProxyMiddleware({
      target: 'http://13.201.230.206', // Your backend's HTTP server
      changeOrigin: true,
      secure: false, // Disable SSL verification for HTTP
    })
  );
};
