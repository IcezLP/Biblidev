module.exports = (file) => {
  const errors = {};

  if (!file) {
    errors.import = 'Veuillez sélectionner un fichier';
  }

  if (file) {
    const types = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

    if (!types.includes(file.type)) {
      errors.import = 'Veuillez sélectionner un fichier au format XLSX';
    }
  }

  return errors;
};
