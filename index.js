const express = require('express');
const authRoute = require('./src/routes/v1/auth.route');
const userRoute = require('./src/routes/v1/user.route');
const docsRoute = require('./src/routes/v1/docs.route');
const groupRoute = require('./src/routes/v1/group.route');
const presentationRoute = require('./src/routes/v1/presentation.route');
const config = require('./src/config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/users',
    route: userRoute,
  },
  {
    path: '/groups',
    route: groupRoute,
  },
  {
    path: '/presentations',
    route: presentationRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
