const Validator = require('validator');
const { isEmpty } = require('lodash');

module.exports = (data) => {
  const errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = "Cette adresse e-mail n'est pas valide";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Ce champ est requis';
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = 'Ce champ est requis';
  }

  return errors;
};
