const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { kebabCase } = require('lodash');
const crypto = require('crypto');
const User = require('../database/models/User');
const Token = require('../database/models/Token');
const loginFieldsValidation = require('../validation/auth/login');
const registerFieldsValidation = require('../validation/auth/register');
const forgotFieldsValidation = require('../validation/auth/forgot');
const resetFieldsValidation = require('../validation/auth/reset');
const sendEmail = require('../services/amazon-ses');
const verifyTemplate = require('../emailTemplates/verify');
const resetTemplate = require('../emailTemplates/reset');

/**
 * Connecter un utilisateur
 *
 * @async
 * @route POST /api/auth/login
 * @public
 * @return {String} Token d'authentification
 */
router.post('/login', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = loginFieldsValidation(req.body);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  try {
    // Cherche l'utilisateur
    const user = await User.findOne({ email: req.body.email });

    // Si aucun utilisateur n'est trouvé ou si le mot de passe ne correspond pas
    if (!user || (user && !(await bcrypt.compare(req.body.password, user.password)))) {
      return res.status(404).json({
        status: 'error',
        data: {},
        message: 'Adresse mail ou mot de passe incorrect',
      });
    }

    // Si l'utilisateur n'a pas confirmé son adresse e-mail
    if (!user.verified) {
      return res.status(400).json({
        status: 'error',
        data: {
          userId: user._id,
        },
        message: 'Veuillez confirmer votre adresse mail pour continuer',
      });
    }

    // Génere un token d'authentification
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);

    // Renvoi le token d'authentification
    return res.status(200).json({
      status: 'success',
      data: { token },
      message: null,
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayer',
    });
  }
});

/**
 * Inscrire un utilisateur
 *
 * @async
 * @route POST /api/auth/register
 * @public
 */
router.post('/register', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = await registerFieldsValidation(req.body, User);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  try {
    // Déstructure les données reçu pour éviter l'injection de données non voulues
    const { username, email, password } = req.body;
    // Génère un slug à partir du nom d'utilisateur pour avoir des urls propres
    const slug = kebabCase(username);
    // Hash le mot de passe pour qu'il ne soit pas affiché en clair dans la db
    const hash = await bcrypt.hash(password, 10);
    // Génère un token pour la validation de l'email
    const token = crypto.randomBytes(32).toString('hex');
    // Récupère la date
    const date = new Date();
    // Génère un avatar via l'API de http://avatars.adorable.io/
    const avatar = `https://api.adorable.io/avatars/200/${date.getTime()}-${slug}.png`;

    // Initialise le nouvel utilisateur
    const user = new User({
      avatar,
      username,
      slug,
      email,
      verified: false,
      password: hash,
      isAdmin: false,
    });

    // Sauvegarde l'utilisateur dans la db
    await user.save(async (error) => {
      if (error) {
        console.log(error);
      } else {
        // Sauvegarde le token dans la db
        await Token.create({
          type: 'emailValidation',
          user: user._id,
          token,
        });

        await sendEmail(
          [email],
          "Confirmation de l'adresse mail",
          null,
          verifyTemplate(user.username, `${process.env.SITE_URL}/verification?token=${token}`),
        );
      }
    });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: null,
    });
  } catch (error) {
    console.log(error);
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayer',
    });
  }
});

/**
 * Demande de mot de passe oublié
 *
 * @async
 * @route POST /api/auth/forgot
 * @public
 */
router.post('/forgot', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = forgotFieldsValidation(req.body);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  try {
    // Déstructure les données reçu pour éviter l'injection de données non voulues
    const { email } = req.body;
    // Génère un token pour la réinitialisation du mot de passe
    const token = crypto.randomBytes(32).toString('hex');
    // Cherche l'utilisateur qui a fait la demande de réinitialisation
    const user = await User.findOne({ email });

    // Si aucun utilisateur n'est trouvé
    if (!user) {
      return res.status(200).json({
        status: 'success',
        data: {},
        message: null,
      });
    }

    // Sauvegarde le token dans la db, expire après 20 minutes
    await Token.create({
      type: 'passwordReset',
      user: user._id,
      token,
      expireAt: new Date(Date.now() + 1000 * 60 * 20),
    });

    // Envoi le mail contenant le lien pour réinitialiser le mot de passe
    await sendEmail(
      [email],
      'Mot de passe oublié',
      null,
      resetTemplate(user.username, `${process.env.SITE_URL}/nouveau-mot-de-passe?token=${token}`),
    );

    return res.status(200).json({
      status: 'success',
      data: {},
      message: null,
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayer',
    });
  }
});

/**
 * Modifie le mot de passe d'un utilisateur
 *
 * @async
 * @route POST /api/auth/reset/:token
 * @public
 */
router.post('/reset/:token', async (req, res) => {
  // Vérifie les champs du formulaire
  const errors = resetFieldsValidation(req.body);

  // Si le formulaire contient des erreurs
  if (Object.keys(errors).length !== 0) {
    return res.status(400).json({
      status: 'error',
      data: errors,
      message: null,
    });
  }

  const { token } = req.params;

  try {
    const reset = await Token.findOne({ token });

    // Si il n'y a pas de token ou que le type est incorrect
    if (!reset || (reset && reset.type !== 'passwordReset')) {
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "La demande de réinitialisation n'existe pas ou a expirée",
      });
    }

    // Déstructure les données reçu pour éviter l'injection de données non voulues
    const { password } = req.body;
    // Hash le mot de passe pour qu'il ne soit pas affiché en clair dans la db
    const hash = await bcrypt.hash(password, 10);

    // Supprime le token de la db
    await reset.remove();
    // Met à jour le mot de passe de l'utilisateur
    await User.findByIdAndUpdate(reset.user, { $set: { password: hash } });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: null,
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayer',
    });
  }
});

/**
 * Vérifie l'adresse mail d'un utilisateur
 *
 * @async
 * @route POST /api/auth/verify/:token
 * @public
 */
router.post('/verify/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const verify = await Token.findOne({ token });

    // Si il n'y a pas de token ou que le type est incorrect
    if (!verify || (verify && verify.type !== 'emailValidation')) {
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Aucune vérification correspondante n'a été trouvée",
      });
    }

    // Supprime le token de la db
    await verify.remove();
    // Met à jour le statut de vérification de l'adresse mail de l'utilisateur
    await User.findByIdAndUpdate(verify.user, { $set: { verified: true } });

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'Votre adresse mail est validée, vous pouvez maintenant vous connecter',
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayer',
    });
  }
});

/**
 * Ré-envoi un email de validation
 *
 * @async
 * @route POST /api/auth/resend
 * @public
 */
router.post('/resend/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    const verify = await Token.findOne({ user: userId });

    if (!user) {
      // Si une erreur inconnue arrive
      return res.status(400).json({
        status: 'error',
        data: {},
        message: "Aucun utilisateur n'a été trouvé",
      });
    }

    // Si aucun token de validation n'a été trouvé
    if (!verify || (verify && verify.type !== 'emailValidation')) {
      // Génère un nouveau token pour la validation de l'email
      const token = crypto.randomBytes(32).toString('hex');

      // Sauvegarde le token dans la db
      await Token.create({
        type: 'emailValidation',
        user: userId,
        token,
      });

      await sendEmail(
        [user.email],
        "Confirmation de l'adresse mail",
        null,
        verifyTemplate(user.username, `${process.env.SITE_URL}/verification?token=${token}`),
      );

      return res.status(200).json({
        status: 'success',
        data: {},
        message: null,
      });
    }

    await sendEmail(
      [user.email],
      "Confirmation de l'adresse mail",
      null,
      verifyTemplate(user.username, `${process.env.SITE_URL}/verification?token=${verify.token}`),
    );

    return res.status(200).json({
      status: 'success',
      data: {},
      message: 'Votre adresse mail est validée, vous pouvez maintenant vous connecter',
    });
  } catch (error) {
    // Si une erreur inconnue arrive
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Une erreur est survenue, veuillez réessayer',
    });
  }
});

module.exports = router;
