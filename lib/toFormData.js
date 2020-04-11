export default (data) => {
  const formData = new FormData();

  if (data instanceof Object) {
    Object.keys(data).forEach((key) => {
      const value = data[key];

      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value);
      }
    });
  }

  return formData;
};
