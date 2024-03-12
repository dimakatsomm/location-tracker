import express from 'express';
import Container from 'typedi';
import { validateUserToken } from '../middleware';
import { LocationController } from '../controllers/location.controller';

const router = express.Router();
const controller = Container.get(LocationController);

router.get('/', validateUserToken(), controller.locationHistory);
router.post('/', validateUserToken(), controller.saveLocation);

export default router;
