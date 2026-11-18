import app from './app';
import config from './config';

const PORT = config.port || 5000;

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏫 A. P PUBLIC SCHOOL, JHANSI - PRODUCTION ERP BACKEND`);
  console.log(`🚀 Server listening on port: ${PORT} (Environment: ${config.env})`);
  console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
  console.log(`📚 API Endpoint: http://localhost:${PORT}/api/v1`);
  console.log(`=======================================================`);
});
