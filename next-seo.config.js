export default {
  title: 'Bibliothèque communautaire de ressources',
  titleTemplate: `${process.env.SITE_NAME} | %s`,
  description:
    'Inspiration, API, Outils, SEO, Frameworks, Veille, Emplois... Des centaines de ressources prêtes à être utilisées dans le développement web et le web design',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.SITE_URL,
    site_name: process.env.SITE_NAME,
    images: [
      {
        url: `${process.env.SITE_URL}/images/logo_block.png`,
        width: 800,
        height: 600,
        alt: process.env.SITE_NAME,
      },
    ],
  },
};
