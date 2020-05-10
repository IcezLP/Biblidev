const router = require('express').Router();
const si = require('systeminformation');
const User = require('../../database/models/User');
const Resource = require('../../database/models/Resource');

router.get('/server', async (req, res) => {
  const options = {
    osInfo: 'platform, distro, release, codename, kernel, arch, uefi',
    time: 'uptime',
    versions: 'node, npm, git, mongodb, apache, nginx',
    cpuCurrentspeed: 'min, max, avg',
    mem: 'total, free, used, active, available',
    fsSize: '*',
  };

  const expressUptime = process.uptime();

  try {
    const data = await si.get(options);

    return res.status(200).json({
      status: 'success',
      data: {
        ...data,
        expressUptime,
      },
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

router.get('/total/:model', async (req, res) => {
  const models = ['users', 'resources'];
  let Model;

  if (!models.includes(req.params.model)) {
    return res.status(400).json({
      status: 'error',
      data: {},
      message: 'Veuillez séléctionner un modèle valide',
    });
  }

  switch (req.params.model) {
    case 'users':
      Model = User;
      break;
    case 'resources':
      Model = Resource;
      break;
    default:
      return null;
  }

  try {
    const documents = await Model.find().select('createdAt');

    return res.status(200).json({
      status: 'success',
      data: documents,
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
