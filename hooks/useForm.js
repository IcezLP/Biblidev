import { useState, useEffect } from 'react';
import fetch from '../lib/fetch';
import toFormData from '../lib/toFormData';

export default (callback, method, url, hasFile = false) => {
  const [values, setValues] = useState({});
  const [data, setData] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Si il n'y à aucune erreur et que le chargement est toujours actif
    if (Object.keys(errors).length === 0 && isLoading) {
      callback(data);
    }

    // Termine le chargement de la requête
    setIsLoading(false);
  }, [errors]);

  // Mise à jour des valeurs
  const handleChange = (event) => {
    if (event.persist) event.persist();

    // Ajoute la nouvelle valeur à celle(s) déjà existante(s)
    setValues((values) => ({
      ...values,
      [event.target.name]: event.target.value,
    }));
  };

  // Action finale
  const handleSubmit = async (event) => {
    if (event.preventDefault) event.preventDefault();
    // Commence le chargement de la requête
    setIsLoading(true);

    let formData;

    if (hasFile) {
      formData = toFormData(values);
    }

    // Effectue la requête
    const response = await fetch(method, url, hasFile ? formData : values);

    switch (response.status) {
      case 'success':
        // Si la réponse contient des données à renvoyer
        if (Object.keys(response.data).length !== 0) {
          setData(response.data);
        }
        setValues({}); // Réinitialise les valeurs
        setErrors({}); // Réinitialise les erreurs
        break;
      case 'error':
        setErrors((response.message && { message: response.message }) || response.data);
        break;
      default:
        setErrors({ message: 'Une erreur est survenue, veuillez réessayer' });
    }
  };

  return { values, errors, isLoading, handleChange, handleSubmit };
};
