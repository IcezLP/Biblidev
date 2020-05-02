import { createMedia } from '@artsy/fresnel';

const media = createMedia({
  breakpoints: {
    xs: 0,
    sm: 768,
    md: 1000,
    lg: 1200,
  },
});

export const mediaStyles = media.createMediaStyle();
export const { Media, MediaContextProvider } = media;
