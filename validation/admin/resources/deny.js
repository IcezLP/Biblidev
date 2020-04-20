const Validator = require('validator');
const { isEmpty } = require('lodash');

module.exports = (data, file, Resource) => {
  const errors = {};

  data.reason = !isEmpty(data.reason) ? data.reason : '';
  data.custom = !isEmpty(data.custom) ? data.custom : '';

  if (Validator.isEmpty(data.reason)) {
    errors.reason = 'Veuillez sélectionner une raison';
  }

  if (data.reason === 'custom' && Validator.isEmpty(data.custom)) {
    errors.custom = 'Veuillez préciser une raison';
  }

  return errors;
};
