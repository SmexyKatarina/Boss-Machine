const express = require('express');
const apiRouter = express.Router();
const minionsRouter = require('./routers/minionsRouter.js');
const ideasRouter = require('./routers/ideasRouter.js');
const meetingsRouter = require('./routers/meetingsRouter.js');
const { status } = require('express/lib/response.js');

// /api/minions routes

apiRouter.use('/minions', minionsRouter);
apiRouter.use('/ideas', ideasRouter);
apiRouter.use('/meetings', meetingsRouter);

module.exports = apiRouter;
