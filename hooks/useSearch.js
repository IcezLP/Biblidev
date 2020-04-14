import { useState } from 'react';

export default (defaultSort = '') => {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState(defaultSort);

  // Met à jour le state de recherche
  const handleSearch = (event) => {
    if (event.persist) event.persist();
    setSearch(event.target.value);
  };

  // Met à jour l'ordre d'affichage
  const handleSort = (event) => {
    if (event.persist) event.persist();
    setSortBy(event.target.value);
  };

  return { search, handleSearch, sortBy, handleSort };
};
