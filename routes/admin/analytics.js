const router = require('express').Router();
const { google } = require('googleapis');
const moment = require('moment');

const analytics = google.analytics('v3');

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_CLIENT_EMAIL,
  key: process.env.GOOGLE_PRIVATE_KEY.replace(new RegExp('\\\\n'), '\n'),
  scopes: ['https://www.googleapis.com/auth/analytics.readonly'],
});

/**
 * Récupère les sessions ou les utilisateurs
 *
 * @async
 * @route GET /api/admin/analytics
 * @private
 */
router.get('/', async (req, res) => {
  const { metrics } = req.query;
  const startDate = req.query.start ? req.query.start : '7daysAgo';
  const endDate = req.query.end ? req.query.end : 'yesterday';

  try {
    // Récupère les données via l'API de Google Analytics
    const result = await analytics.data.ga.get({
      auth,
      ids: `ga:${process.env.GOOGLE_VIEW_ID}`,
      metrics: `ga:${metrics}`,
      'start-date': startDate,
      'end-date': endDate,
      dimensions: 'ga:date',
    });

    // Si aucune donnée n'est récupèrer
    if (!result.data.rows) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: '',
      });
    }

    // Converti les données en tableau d'objets
    const data = result.data.rows.map((row) => {
      // Converti la date au format DD MMM (01 Jan.)
      const date = moment(row[0])
        .locale('fr')
        .format('DD MMM');

      return {
        Date: date,
        Utilisateurs: Number(row[1]), // Converti la chaîne en chiffre/nombre
      };
    });

    return res.status(200).json({
      status: 'success',
      data,
      message: '',
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayez',
    });
  }
});

/**
 * Statistiques de vue des pages
 *
 * @async
 * @route GET /api/admin/analytics/views
 * @private
 */
router.get('/views', async (req, res) => {
  const startDate = req.query.start ? req.query.start : '7daysAgo';
  const endDate = req.query.end ? req.query.end : 'yesterday';

  try {
    // Récupère les données via l'API de Google Analytics
    const result = await analytics.data.ga.get({
      auth,
      ids: `ga:${process.env.GOOGLE_VIEW_ID}`,
      metrics:
        'ga:pageviews,ga:uniquepageviews,ga:avgtimeonpage,ga:entrances,ga:exitrate,ga:bouncerate',
      'start-date': startDate,
      'end-date': endDate,
      dimensions: 'ga:pagepath',
      sort: '-ga:pageviews',
    });

    // Si aucune donnée n'est récupèrer
    if (!result.data.rows) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: '',
      });
    }

    // Converti les données en tableau d'objets
    const data = result.data.rows.map((row, index) => {
      // Converti les secondes au format HH:mm:ss (00:00:00)
      const duration = moment.utc(row[3] * 1000).format('HH:mm:ss');
      // Réduit le pourcentage à deux chiffres après la virgule
      const exitrate = Number(row[5]).toFixed(2);
      // Réduit le pourcentage à deux chiffres après la virgule
      const bouncerate = Number(row[6]).toFixed(2);

      return {
        id: index,
        page: row[0],
        total: Number(row[1]), // Converti la chaîne en chiffre/nombre
        unique: Number(row[2]), // Converti la chaîne en chiffre/nombre
        duration,
        entrances: Number(row[4]), // Converti la chaîne en chiffre/nombre
        exitrate: Number(exitrate), // Converti la chaîne en chiffre/nombre
        bouncerate: Number(bouncerate), // Converti la chaîne en chiffre/nombre
      };
    });

    return res.status(200).json({
      status: 'success',
      data,
      message: '',
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayez',
    });
  }
});

/**
 * Appareils utilisés
 *
 * @async
 * @route GET /api/admin/analytics/devices
 * @private
 */
router.get('/devices', async (req, res) => {
  const startDate = req.query.start ? req.query.start : '7daysAgo';
  const endDate = req.query.end ? req.query.end : 'yesterday';

  try {
    // Récupère les données via l'API de Google Analytics
    const result = await analytics.data.ga.get({
      auth,
      ids: `ga:${process.env.GOOGLE_VIEW_ID}`,
      metrics: 'ga:sessions',
      'start-date': startDate,
      'end-date': endDate,
      dimensions: 'ga:devicecategory',
    });

    // Si aucune donnée n'est récupèrer
    if (!result.data.rows) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: '',
      });
    }

    // Récupère le nombre total d'appareils
    const sum = result.data.rows.reduce((a, b) => a + (Number(b[1]) || 0), 0);

    // Converti les données en tableau d'objets
    const data = result.data.rows.map((row) => {
      // Génère le pourcentage d'appareils
      const percent = Number((Number(row[1]) / sum) * 100).toFixed(2);
      let device;

      // Traduit l'appareil en français
      switch (row[0]) {
        case 'desktop':
          device = 'Ordinateur';
          break;
        case 'mobile':
          device = 'Mobile';
          break;
        default:
          device = row[0];
      }

      return {
        item: device,
        value: Number(row[1]), // Converti la chaîne en chiffre/nombre
        percent: Number(percent), // Converti la chaîne en chiffre/nombre
      };
    });

    return res.status(200).json({
      status: 'success',
      data,
      message: '',
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayez',
    });
  }
});

/**
 * Actions réalisées sur le site
 *
 * @async
 * @route GET /api/admin/analytics/actions
 * @private
 */
router.get('/actions', async (req, res) => {
  const startDate = req.query.start ? req.query.start : '7daysAgo';
  const endDate = req.query.end ? req.query.end : 'yesterday';

  try {
    // Récupère les données via l'API de Google Analytics
    const result = await analytics.data.ga.get({
      auth,
      ids: `ga:${process.env.GOOGLE_VIEW_ID}`,
      metrics: 'ga:totalevents',
      'start-date': startDate,
      'end-date': endDate,
      dimensions: 'ga:eventaction',
      sort: '-ga:totalevents',
    });

    // Si aucune donnée n'est récupèrer
    if (!result.data.rows) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: '',
      });
    }

    // Converti les données en tableau d'objets
    const data = result.data.rows.map((row, index) => {
      return {
        id: index,
        action: row[0],
        value: Number(row[1]), // Converti la chaîne en chiffre/nombre
      };
    });

    return res.status(200).json({
      status: 'success',
      data,
      message: '',
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayez',
    });
  }
});

/**
 * Événements du site
 *
 * @async
 * @route GET /api/admin/analytics/totalevents
 * @private
 */
router.get('/totalevents', async (req, res) => {
  const startDate = req.query.start ? req.query.start : '7daysAgo';
  const endDate = req.query.end ? req.query.end : 'yesterday';

  try {
    // Récupère les données via l'API de Google Analytics
    const result = await analytics.data.ga.get({
      auth,
      ids: `ga:${process.env.GOOGLE_VIEW_ID}`,
      metrics: 'ga:totalevents,ga:uniqueevents',
      'start-date': startDate,
      'end-date': endDate,
      dimensions: 'ga:date',
    });

    // Si aucune donnée n'est récupèrer
    if (!result.data.rows) {
      return res.status(200).json({
        status: 'success',
        data: [],
        message: '',
      });
    }

    // Converti les données en tableau d'objets
    const data = result.data.rows.map((row) => {
      // Converti la date au format DD MMM (01 Jan.)
      const date = moment(row[0])
        .locale('fr')
        .format('DD MMM');

      return {
        Date: date,
        Total: Number(row[1]), // Converti la chaîne en chiffre/nombre
        Unique: Number(row[2]), // Converti la chaîne en chiffre/nombre
      };
    });

    return res.status(200).json({
      status: 'success',
      data,
      message: '',
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayez',
    });
  }
});

module.exports = router;
