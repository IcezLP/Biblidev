import { useEffect, useState } from 'react';

export default () => {
  const [width, setWidth] = useState(null);
  const [height, setHeight] = useState(null);

  if (process.browser) {
    useEffect(() => {
      const updateSize = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
      };

      setHeight(document.children[0].clientHeight);
      setWidth(document.children[0].clientWidth);

      window.addEventListener('resize', updateSize);
    }, []);
  }

  return { width, height };
};
