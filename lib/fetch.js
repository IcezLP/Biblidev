const Axios = require('axios');
const cookies = require('js-cookie');

module.exports = async (method, url, data = {}) => {
  // Récupère le token de connexion
  const token = cookies.get('auth');

  // Attache le token de connexion aux requêtes
  if (token) {
    Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await Axios[method](`${process.env.SITE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
