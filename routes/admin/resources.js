const router = require('express').Router();
const moment = require('moment');
const { v2 } = require('cloudinary');
const formidable = require('formidable');
const XLSX = require('xlsx');
const { kebabCase } = require('lodash');
const mongoose = require('mongoose');
const Resource = require('../../database/models/Resource');
const User = require('../../database/models/User');
const sendEmail = require('../../services/amazon-ses');
const acceptedTemplate = require('../../emailTemplates/accepted');
const deniedTemplate = require('../../emailTemplates/denied');
const denyFieldsValidation = require('../../validation/admin/resources/deny');
const importFileValidation = require('../../validation/admin/resources/importFile');
const importDataValidation = require('../../validation/admin/resources/importData');

const { hostname: cloud_name, username: api_key, password: api_secret } = new URL(
  process.env.CLOUDINARY_URL,
);

v2.config({
  cloud_name,
  api_key,
  api_secret,
});

/**
 * Récupère les ressources
 *
 * @async
 * @route GET /api/admin/resources
 * @private
 */
router.get('/', async (req, res) => {
  let state;
  let sort;

  switch (String(req.query.state)) {
    case 'valid':
      state = 'Validée';
      break;
    case 'awaiting':
      state = 'En attente de validation';
      break;
    default:
      state = 'Validée';
  }

  switch (String(req.query.sort)) {
    case 'none':
      sort = {};
      break;
    case 'newest':
      sort = { createdAt: -1 };
      break;
    case 'oldest':
      sort = { createdAt: 1 };
      break;
    case 'ascending':
      sort = { slug: 1 };
      break;
    case 'descending':
      sort = { slug: -1 };
      break;
    default:
      sort = { slug: 1 };
  }

  try {
    const resources = await Resource.find({ state })
      .sort(sort)
      .populate('categories')
      .populate('author', '_id username slug');

    return res.status(200).json({
      status: 'success',
      data: { resources },
      message: null,
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
 * Ressources aimées par un utilisateur
 *
 * @async
 * @route GET /api/admin/resources/favorites/:id
 * @private
 */
router.get('/favorites/:id', async (req, res) => {
  try {
    const resources = await Resource.find({ favorites: req.params.id })
      .sort({ createdAt: 1 })
      .populate('author', '_id username slug');

    return res.status(200).json({
      status: 'success',
      data: { resources },
      message: null,
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
 * Ressources partagées par un utilisateur
 *
 * @async
 * @route GET /api/admin/resources/favorites/:id
 * @private
 */
router.get('/shared/:id', async (req, res) => {
  try {
    const resources = await Resource.find({ author: req.params.id }).sort({ createdAt: 1 });

    return res.status(200).json({
      status: 'success',
      data: { resources },
      message: null,
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
 * Valide une ressource
 *
 * @async
 * @route POST /api/admin/resources/accept/:id
 * @private
 */
router.post('/accept/:id', async (req, res) => {
  try {
    // Cherche la ressource
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      // Si aucune ressource n'est trouvée
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Aucune ressource n'a été trouvée",
      });
    }

    resource.state = 'Validée';

    resource.save(async (err) => {
      if (!err) {
        const user = await User.findById(resource.author);

        if (user && user.notifications) {
          const date = moment(resource.createdAt).format('DD MMMM YYYY');

          await sendEmail(
            [user.email],
            'Votre ressource a été acceptée',
            null,
            acceptedTemplate(user.username, date, resource.name),
          );
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'La ressource a bien été validée',
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
 * Refuse une ressource
 *
 * @async
 * @route PUT /api/admin/resources/deny/:id
 * @private
 */
router.put('/deny/:id', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = denyFieldsValidation(req.body);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  try {
    const { custom } = req.body;
    let reason;

    switch (req.body.reason) {
      case 'exist':
        reason = 'La ressource existe déjà';
        break;
      case 'rules':
        reason = 'La ressource ne respecte pas les règles';
        break;
      default:
        reason = custom;
    }

    // Cherche la ressource
    const resource = await Resource.findById(req.params.id);

    if (resource.logo) {
      // Supprime l'image du serveur Cloudinary
      await v2.uploader.destroy(resource.logo);
    }

    if (!resource) {
      // Si aucune ressource n'est trouvée
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Aucune ressource n'a été trouvée",
      });
    }

    const user = await User.findById(resource.author);

    resource.remove(async (err) => {
      if (!err) {
        if (user && user.notifications) {
          const date = moment(resource.createdAt).format('DD MMMM YYYY');

          await sendEmail(
            [user.email],
            'Votre ressource a été refusée',
            null,
            deniedTemplate(user.username, date, resource.name, reason),
          );
        }
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'La ressource a été refusée',
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
 * Supprime une ressource
 *
 * @async
 * @route DELETE /api/admin/resources/:id
 * @private
 */
router.delete('/:id', async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (resource.logo) {
      // Supprime l'image du serveur Cloudinary
      await v2.uploader.destroy(resource.logo);
    }

    await resource.remove();

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'La ressource a été supprimée',
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
 * Import des ressources
 *
 * @async
 * @route POST /api/admin/resources/import
 * @private
 */
router.post('/import', (req, res) => {
  const form = new formidable.IncomingForm();

  return form.parse(req, async (err, fields, files) => {
    if (err) {
      // Si une erreur inconnue arrive
      return res.status(400).json({
        status: 'error',
        data: {},
        message: 'Une erreur est survenue, veuillez réessayez',
      });
    }

    // Vérifie le fichier reçu
    const errors = importFileValidation(files.import);

    // Si le fichier est incorrect
    if (Object.keys(errors).length !== 0) {
      return res.status(400).json({
        status: 'error',
        data: errors,
        message: null,
      });
    }

    // Lis le fichier Excel
    const workbook = XLSX.readFile(files.import.path);
    const sheet_name_list = workbook.SheetNames;
    // Convertie en JSON
    const resources = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]], {
      defval: '',
    });

    // Initialise un tableau vide pour les erreurs de validation
    const validation = [];

    // Valide chaque lignes
    await Promise.all(
      resources.map(async (resource, index) => {
        // Vérifie les données des champs
        const dataErrors = await importDataValidation(resource, Resource);

        // Si la ligne contient des erreurs
        if (Object.keys(dataErrors).length !== 0) {
          // Ajout la position de la ligne aux erreurs
          dataErrors.position = index + 2;
          validation.push(dataErrors);
        }
      }),
    );

    if (validation.length !== 0) {
      return res.status(400).json({
        status: 'error',
        data: {
          // Tri par le numéro de la ligne
          validation: validation.sort((a, b) => {
            if (a.position > b.position) return 1;
            if (b.position > a.position) return -1;
            return 0;
          }),
        },
        message: null,
      });
    }

    const seen = new Set();

    // Vérifie si il le fichier a des noms dupliquéss
    const hasDuplicates = resources.some((obj) => {
      return seen.size === seen.add(obj.name).size;
    });

    if (hasDuplicates) {
      return res.status(400).json({
        status: 'error',
        data: {},
        message: 'Des noms identiques ont été trouvés, veuillez vérifier le fichier',
      });
    }

    // Initialise un array pour les nouveaux documents
    const resourcesToDocuments = [];

    await Promise.all(
      resources.map(async (resource, index) => {
        // Si les categories sont toujours en string, convertie en array
        if (!Array.isArray(resource.categories)) {
          resource.categories = resource.categories.split(';');
        }

        // Convertie les id en ObjectID pour le populate
        resource.categories = resource.categories.map((category) =>
          mongoose.Types.ObjectId(category),
        );

        // Génère un slug à partir du nom de la ressource pour avoir des urls propres
        resource.slug = kebabCase(resource.name);

        // Si le lien d'un logo est donné
        if (resource.logo) {
          try {
            // Upload sur le serveur cloud de Cloudinary
            const { public_id } = await v2.uploader.upload(resource.logo);
            resource.logo = public_id;
          } catch (error) {
            console.log(error);
          }
        }

        // Ajout le document dans le tableau
        resourcesToDocuments.push(new Resource({ ...resource }));
      }),
    );

    try {
      await Resource.insertMany(resourcesToDocuments);

      return res.status(200).json({
        status: 'success',
        data: {},
        message: "L'importation à réussi, les ressources sont disponibles à la validation",
      });
    } catch (error) {
      console.log(error);
      await Promise.all(
        resourcesToDocuments.map(async (resource) => {
          if (resource.logo) {
            // Supprime l'image du serveur Cloudinary
            await v2.uploader.destroy(resource.logo);
          }

          // Supprime les ressources qui ont déjà été sauvegardées
          await Resource.findByIdAndDelete(resource._id);
        }),
      );

      // Si une erreur inconnue arrive
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Une erreur est survenue, l'importation a été annulée",
      });
    }
  });
});

module.exports = router;
