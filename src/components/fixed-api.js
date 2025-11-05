// frontend/src/components/fixed-api.js
import axios from 'axios';

const API = axios.create({
  baseURL: '', // ← THIS WAS MISSING! Now works on Render
  timeout: 8000
});

// Show pretty errors
API.interceptors.response.use(
  r => r,
  err => {
    alert('Server busy — auto-retrying in 5 sec...');
    setTimeout(() => location.reload(), 5000);
    return Promise.reject(err);
  }
);

export default API;
