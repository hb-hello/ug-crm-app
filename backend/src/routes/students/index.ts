import express from 'express';
import searchRouter from './search';
import statsRouter from './stats';

const router = express.Router();

import getRouter from './get';

// Mount sub-routes
router.use('/', searchRouter);
router.use('/', statsRouter);
router.use('/', getRouter);

export default router;
