const Validator = require('validator');
const { isEmpty } = require('lodash');

module.exports = (data) => {
  const errors = {};

  data.email = !isEmpty(data.email) ? data.email : '';

  if (!Validator.isEmail(data.email)) {
    errors.email = "Cette adresse mail n'est pas valide";
  }

  if (Validator.isEmpty(data.email)) {
    errors.email = 'Veuillez remplir ce champ';
  }

  return errors;
};
