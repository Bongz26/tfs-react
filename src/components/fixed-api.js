import axios from 'axios';
const API = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5001'
});
API.interceptors.response.use(
  r => r,
  err => {
    alert('Server says: ' + (err.response?.data?.error || err.message));
    throw err;
  }
);
export default API;
