// ملف: src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8000', // <-- البورت والدومين المطلوب
      changeOrigin: true,
      timeout: 100000, // <-- زيادة المهلة إلى 60 ثانية لتجنب 504 Gateway Timeout
    })
  );
};