import express from 'express';
import Container from 'typedi';
import { validateUserSession } from '../middleware/auth.middleware';
import { LocationController } from '../controllers/location.controller';

const router = express.Router();
const controller = Container.get(LocationController);

router.get('/', validateUserSession(), controller.locationHistory);
router.post('/', validateUserSession(), controller.saveLocation);

export default router;
