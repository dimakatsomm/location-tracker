import express from 'express';
import Container from 'typedi';
import { AuthController } from '../controllers/auth.controller';
import { validateUser } from '../middleware/auth.middleware';

const router = express.Router();
const controller = Container.get(AuthController);

router.post('/register', controller.register);
router.post('/login', controller.login);
router.post('/verify', validateUser(), controller.verify);

export default router;
