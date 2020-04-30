const Validator = require('validator');
const { isEmpty, kebabCase } = require('lodash');

module.exports = async (data, Category) => {
  const errors = {};

  data.name = !isEmpty(data.name) ? data.name : '';
  data.plural_name = !isEmpty(data.plural_name) ? data.plural_name : '';

  if (await Category.findOne({ name: data.name })) {
    errors.name = 'Une catégorie portant ce nom existe déjà';
  }

  if (!Validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = 'Le nom doit être compris entre 2 et 30 charactères';
  }

  if (Validator.isEmpty(data.name)) {
    errors.name = 'Veuillez remplir ce champ';
  }

  if (!Validator.isEmpty(data.plural_name)) {
    if (await Category.findOne({ slug: kebabCase(data.plural_name) })) {
      errors.plural_name = 'Une catégorie portant ce pluriel existe déjà';
    }

    if (!Validator.isLength(data.plural_name, { min: 2, max: 35 })) {
      errors.plural_name = 'Le pluriel doit être compris entre 2 et 30 charactères';
    }
  }

  return errors;
};
