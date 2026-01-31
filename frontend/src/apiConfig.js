
// In production, force the Render URL to ensure HTTPS and correct backend
const API_BASE_URL = import.meta.env.PROD
    ? 'https://finsight-backend-5yo4.onrender.com/api/v1'
    : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1');

export default API_BASE_URL;
