/* eslint-disable @typescript-eslint/no-var-requires */
const { createProxyMiddleware } = require('http-proxy-middleware');

const host = process.env.REACT_APP_API_HOST ? process.env.REACT_APP_API_HOST : 'localhost';
const port = process.env.REACT_APP_API_PORT ? process.env.REACT_APP_API_PORT : '8098';

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: `http://${host}:${port}`,
      changeOrigin: true,
    })
  );
};
