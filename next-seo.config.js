export default {
  title: 'Des ressources prêtes à être utilisées',
  titleTemplate: `${process.env.SITE_NAME} | %s`,
  description:
    'Bibliothèque de ressources utilisées dans le développement web et le web design. Plus besoin de chercher pour trouver son bonheur',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: process.env.SITE_URL,
    site_name: process.env.SITE_NAME,
    images: [
      {
        url: `${process.env.SITE_URL}/images/logo_block.svg`,
        width: 800,
        height: 600,
        alt: process.env.SITE_NAME,
      },
    ],
  },
};
