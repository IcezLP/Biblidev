const Axios = require('axios');

module.exports = async (method, url, data = {}) => {
  try {
    const response = await Axios[method](url, data);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
