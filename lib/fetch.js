const Axios = require('axios');
const cookies = require('js-cookie');

/**
 * @param {String} method Méthode de requête HTTP (GET, POST, PUT, DELETE, PATCH)
 * @param {String} url Route de l'API (/api/...)
 * @param {Object} data Données à envoyer (x-www-form-urlencoded ou form-data)
 * @returns {Object} Réponse de la requête
 */
module.exports = async (method, url, data = {}) => {
  // Récupère le token de connexion
  const token = cookies.get('auth');

  // Si un token est trouvé
  if (token) {
    // Passe le token dans le header d'autorisation
    Axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await Axios[method](`${process.env.SITE_URL}${url}`, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
